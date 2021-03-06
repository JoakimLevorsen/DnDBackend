using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Microsoft.EntityFrameworkCore;
using dungeons.database;

namespace dungeons
{
    class ClientManager
    {
        private ConcurrentDictionary<int, WebSocket> connections = new ConcurrentDictionary<int, WebSocket>();
        private ConcurrentDictionary<int, Client> clients = new ConcurrentDictionary<int, Client>();
        private static ClientManager? sharedManager;

        private static readonly object instanceLock = new object();

        public static ClientManager GetInstance()
        {
            if (sharedManager == null)
            {
                lock (instanceLock)
                {
                    if (sharedManager == null)
                    {
                        sharedManager = new ClientManager();
                    }
                }
            }
            return sharedManager;
        }

        public async Task addConnection(WebSocket socket)
        {
            try
            {
                // When a new client connects we add them to the connections, though they are not signed in, so we don't add a client
                int socketId = ClientIdAssigner.GetInstance().GetId();
                connections.AddOrUpdate(socketId, socket, (_, newSocket) => newSocket);
                while (socket.State == WebSocketState.Open)
                {
                    var buffer = new byte[1024 * 4];
                    WebSocketReceiveResult socketResponse;
                    var package = new List<byte>();
                    do
                    {
                        socketResponse = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        package.AddRange(new ArraySegment<byte>(buffer, 0, socketResponse.Count));
                    } while (!socketResponse.EndOfMessage);
                    var stringRecived = System.Text.Encoding.UTF8.GetString(package.ToArray());
                    MessagePayload? payload = null;
                    try
                    {

                        payload = JsonConvert.DeserializeObject<MessagePayload>(stringRecived, new StringEnumConverter())!;
                        Console.WriteLine($"Type is { payload.type } message is { stringRecived }");
                    }
                    catch
                    {
                        await sendPayload($"Could not parse message:{ stringRecived }", socket);
                    }
                    if (payload != null)
                    {
                        await recivedMessage(payload, socket, socketId);
                    }
                }
                Console.WriteLine("Socket closed");
                await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                WebSocket? s;
                connections.Remove(socketId, out s);
                Client? outClient = null;
                clients.Remove(socketId, out outClient);
            }
            catch (Exception e)
            {
                // Fix
                Console.WriteLine("Socket failed");
                Console.WriteLine(e.ToString());
                if (socket != null)
                {
                    await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                }
            }
        }

        async Task recivedMessage(MessagePayload message, WebSocket socket, int id)
        {
            using (var context = GameContext.getNew())
            {
                // First we check if this is a Login call, since they're always allowed
                var client = clients.ContainsKey(id) ? clients[id] : null;
                if (message.type == MessagePayloadType.Login)
                {
                    var newStatus = await LoginManager.login(message.payload);
                    if (newStatus == null)
                    {
                        await sendPayload("LoginManager login 0: Wrong login info", socket);
                    }
                    else
                    {
                        // Now we're signed in, so we create a client
                        User? currentUser = null;
                        try
                        {
                            currentUser = await context.users.SingleAsync(u => u.ID == newStatus.username);
                        }
                        catch { }
                        if (currentUser == null)
                        {
                            var user = new database.User(newStatus.username);
                            context.users.Add(user);
                            await context.SaveChangesAsync();
                            currentUser = user;
                        }
                        await sendPayload(message.payload, socket);
                        client = new Client(newStatus.username, currentUser);
                        clients[id] = client;
                    }
                    return;
                    // We check if this user is signed in
                }
                else if (client != null)
                {
                    switch (message.type)
                    {
                        case MessagePayloadType.Campaign:
                            await sendPayload(await CampaignManager.accept(message.payload, client), client.user.ID);
                            break;
                        case MessagePayloadType.Character:
                            await sendPayload(await CharacterManager.accept(message.payload, client), client.user.ID);
                            break;
                        case MessagePayloadType.DiceRoll:
                            await sendPayload(await DiceRollManager.accept(message.payload, client), client.user.ID);
                            break;
                        case MessagePayloadType.Update:
                            await sendPayload(await GameState.gameStateFor(client), client.user.ID);
                            break;
                        default:
                            await sendPayload($"ClientManager recivedMessage 0: Invalid message type { message.type }", socket);
                            break;
                    }
                }
                else
                {
                    await sendPayload($"ClientManager recivedMessage 1: You must be signed in to use message type { message.type }", socket);
                }
            }
        }

        public async Task sendGameState(string userID)
        {
            var recivers = clients.Where(c => c.Value.user.ID == userID);
            foreach (var r in recivers)
            {
                var gameState = await GameState.gameStateFor(r.Value);
                await sendPayload(gameState, connections[r.Key]);
            }
        }

        public async Task sendPayload(string payload, string userID)
        {
            var recivers = clients.Where(c => c.Value.user.ID == userID);
            foreach (var (key, client) in recivers)
            {
                WebSocket? target;
                if (connections.TryGetValue(key, out target) && target != null)
                {
                    await sendPayload(payload, target);
                }
                else
                {
                    // This means this connection likely does not exist anymore, so we remove it
                    Client? client1;
                    clients.TryRemove(key, out client1);
                }
            }
        }

        async Task sendPayload(string payload, WebSocket reciver)
        {
            var byteResponse = System.Text.Encoding.UTF8.GetBytes(payload);
            var byteArray = new ArraySegment<byte>(byteResponse, 0, byteResponse.Length);
            // We make sure this reciver is still open
            if (reciver.State != WebSocketState.Aborted)
            {
                await reciver.SendAsync(byteArray, WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }

        async Task sendPayload(string payload, WebSocket[] recivers)
        {
            var byteResponse = System.Text.Encoding.UTF8.GetBytes(payload);
            var byteArray = new ArraySegment<byte>(byteResponse, 0, byteResponse.Length);
            foreach (var reciver in recivers)
            {
                if (reciver.State != WebSocketState.Aborted)
                {
                    await reciver.SendAsync(byteArray, WebSocketMessageType.Text, true, CancellationToken.None);
                }
            }
        }
    }

    class MessagePayload
    {
        public MessagePayloadType type;
        public String payload;

        public MessagePayload(MessagePayloadType type, String payload)
        {
            this.type = type;
            this.payload = payload;
        }
    }

    enum MessagePayloadType
    {
        Login,
        Character,
        Campaign,
        Update,
        DiceRoll
    }

    public class Client
    {
        public String socketID;
        public database.User user;

        public Client(string socketID, database.User user)
        {
            this.socketID = socketID;
            this.user = user;
        }
    }
}