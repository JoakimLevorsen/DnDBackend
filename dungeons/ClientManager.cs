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
                connections.Append(new KeyValuePair<int, WebSocket>(socketId, socket));
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
                    var payload = JsonConvert.DeserializeObject<MessagePayload>(stringRecived, new StringEnumConverter());
                    Console.WriteLine($"Type is { payload.type } message is { stringRecived }");
                    await recivedMessage(payload, socket, socketId);
                }
                Console.WriteLine("Socket closed");
                await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                connections.Remove(socketId, out socket);
                Client outClient = null;
                clients.Remove(socketId, out outClient);
            }
            catch (Exception e)
            {
                // Fix
                Console.WriteLine("Socket failed");
                Console.WriteLine(e.ToString());
                if (socket != null) {
                    await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                }
            }
        }

        async Task recivedMessage(MessagePayload message, WebSocket socket, int id)
        {
            var context = DbContextManager.getSharedInstance();
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
                    var currentUser = await context.users.SingleAsync(u => u.ID == newStatus.username);
                    if (currentUser == null) {
                        var user = new database.User { ID = newStatus.username };
                        context.users.Add(user);
                        await context.SaveChangesAsync();
                        currentUser = user;
                        await sendPayload(message.payload, socket);
                    }
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
                        await sendPayload(await CampaignManager.accept(message.payload, client), socket);
                        break;
                    case MessagePayloadType.Character:
                        await sendPayload(await CampaignManager.accept(message.payload, client), socket);
                        break;
                    case MessagePayloadType.Update:
                        await sendPayload(await GameState.gameStateFor(client), socket);
                        break;
                    default:
                        await sendPayload("ClientManager recivedMessage 0: Invalid message type", socket);
                        break;
                }
            }
            else
            {
                await sendPayload("ClientManager recivedMessage 0: Invalid message type", socket);
            }
        }

        public async Task sendGameState(string userID) {
            var recivers = clients.Where(c => c.Value.user.ID == userID);
            foreach (var r in recivers) {
                var gameState = await GameState.gameStateFor(r.Value);
                await sendPayload(gameState, connections[r.Key]);
            }
        }

        public async Task sendPayload(string payload, string userID) {
            var recivers = clients.Where(c => c.Value.user.ID == userID);
            foreach (var r in recivers) {
                await sendPayload(payload, connections[r.Key]);
            }
        }

        async Task sendPayload(string payload, WebSocket reciver)
        {
            var byteResponse = System.Text.Encoding.UTF8.GetBytes(payload);
            var byteArray = new ArraySegment<byte>(byteResponse, 0, byteResponse.Length);
            await reciver.SendAsync(byteArray, WebSocketMessageType.Text, true, CancellationToken.None);
        }

        async Task sendPayload(string payload, WebSocket[] recivers)
        {
            var byteResponse = System.Text.Encoding.UTF8.GetBytes(payload);
            var byteArray = new ArraySegment<byte>(byteResponse, 0, byteResponse.Length);
            foreach (var reciver in recivers)
            {
                await reciver.SendAsync(byteArray, WebSocketMessageType.Text, true, CancellationToken.None);
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

        public Client(string socketID, database.User user) {
            this.socketID = socketID;
            this.user = user;
        }
    }
}