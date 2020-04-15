using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dungeons {
    class ClientManager {
        private ConcurrentDictionary<int, WebSocket> connections = new ConcurrentDictionary<int, WebSocket>();
        private ConcurrentDictionary<int, Client> clients = new ConcurrentDictionary<int, Client>();

        public async Task addConnection(WebSocket socket) {
            try {
                // When a new client connects we add them to the connections, though they are not signed in, so we don't add a client
                int socketId = ClientIdAssigner.GetInstance().GetId();
                connections[socketId] = socket;
                while (socket.State == WebSocketState.Open) {
                    var buffer = new byte[1024 * 4];
                    WebSocketReceiveResult socketResponse;
                    var package = new List<byte>();
                    do {
                        socketResponse = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                        package.AddRange(new ArraySegment<byte>(buffer, 0, socketResponse.Count));
                    } while (!socketResponse.EndOfMessage);
                    var stringRecived = System.Text.Encoding.UTF8.GetString(package.ToArray());
                    var payload = JsonConvert.DeserializeObject<ClientPayload>(stringRecived, new StringEnumConverter());
                    await recivedMessage(payload, socket, socketId);
                }
                await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                connections.Remove(socketId, out socket);
                Client outClient = null;
                clients.Remove(socketId, out outClient);
            } catch {

            }
        }

        async Task recivedMessage(ClientPayload message, WebSocket socket, int id) {
            // First we check if this is a Login call, since they're always allowed
            var client = clients[id];
            if (message.type == ClientPayloadType.Login) {
                var newStatus = await LoginManager.login(message.payload);
                if (newStatus == null) {
                    var response = new ClientPayload(ClientPayloadType.Error, "Wrong login info");
                    await sendPayload(response, socket);
                } else {
                    // Now we're signed in, so we create a client
                    client = new Client();
                    client.id = newStatus.username;
                    clients[id] = client;
                }
                // We check if this user is signed in
            } else if (client != null) {
                switch(message.type) {
                    
                }
            } else {
                await sendPayload(new ClientPayload(ClientPayloadType.Error, "User not signed in"), socket);
            }
        }

        async Task sendPayload(ClientPayload payload, WebSocket reciver) {
            var jsonResponse = JsonConvert.SerializeObject(payload, new StringEnumConverter());
            var byteResponse = System.Text.Encoding.UTF8.GetBytes(jsonResponse);
            var byteArray = new ArraySegment<byte>(byteResponse, 0, byteResponse.Length);
            await reciver.SendAsync(byteArray, WebSocketMessageType.Text, true, CancellationToken.None);
        }

        async Task sendPayload(ClientPayload payload, WebSocket[] recivers) {
            var jsonResponse = JsonConvert.SerializeObject(payload, new StringEnumConverter());
            var byteResponse = System.Text.Encoding.UTF8.GetBytes(jsonResponse);
            var byteArray = new ArraySegment<byte>(byteResponse, 0, byteResponse.Length);
            foreach (var reciver in recivers) {
                await reciver.SendAsync(byteArray, WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }

    class ClientPayload {
        public ClientPayloadType type;
        public String payload;

        public ClientPayload(ClientPayloadType type, String payload) {
            this.type = type;
            this.payload = payload;
        }
    }

    enum ClientPayloadType {
        Login,
        Error
    }

    class Client {
        public String id;
    }
}