using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
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
                connections[socketId] = socket;
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
                    await recivedMessage(payload, socket, socketId);
                }
                await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                connections.Remove(socketId, out socket);
                Client outClient = null;
                clients.Remove(socketId, out outClient);
            }
            catch
            {
                // Fix
            }
        }

        async Task recivedMessage(MessagePayload message, WebSocket socket, int id)
        {
            var context = DbContextManager.getSharedInstance();
            // First we check if this is a Login call, since they're always allowed
            var client = clients[id];
            if (message.type == MessagePayloadType.Login)
            {
                var newStatus = await LoginManager.login(message.payload);
                if (newStatus == null)
                {
                    var response = new MessagePayload(MessagePayloadType.Login, "{status: false, message: \"Wrong login info\"}");
                    await sendPayload(response, socket);
                }
                else
                {
                    // Now we're signed in, so we create a client
                    var currentUser = await context.users.SingleAsync(u => u.ID == newStatus.username);
                    if (currentUser == null) {
                        var user = new database.User { ID = newStatus.username };
                        context.users.Add(user);
                        context.SaveChanges();
                        currentUser = user;
                        var response = new MessagePayload(MessagePayloadType.Login, "{status: true, message: \"Did sign in\"");
                        await sendPayload(response, socket);
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

                }
            }
            else
            {
                await sendPayload(new MessagePayload(MessagePayloadType.Error, "User not signed in"), socket);
            }
        }

        async Task sendPayload(MessagePayload payload, WebSocket reciver)
        {
            var jsonResponse = JsonConvert.SerializeObject(payload, new StringEnumConverter());
            var byteResponse = System.Text.Encoding.UTF8.GetBytes(jsonResponse);
            var byteArray = new ArraySegment<byte>(byteResponse, 0, byteResponse.Length);
            await reciver.SendAsync(byteArray, WebSocketMessageType.Text, true, CancellationToken.None);
        }

        async Task sendPayload(MessagePayload payload, WebSocket[] recivers)
        {
            var jsonResponse = JsonConvert.SerializeObject(payload, new StringEnumConverter());
            var byteResponse = System.Text.Encoding.UTF8.GetBytes(jsonResponse);
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
        Error
    }

    class Client
    {
        public String id;
        public database.User user;

        public Client(string id, database.User user) {
            this.id = id;
            this.user = user;
        }
    }
}