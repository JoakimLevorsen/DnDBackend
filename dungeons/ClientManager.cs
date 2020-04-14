using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace dungeons {
    class ClientManager {
        private HashSet<WebSocket> connections = new HashSet<WebSocket>();
        private Dictionary<int, Client> clients = new Dictionary<int, Client>();

        public async Task addConnection(WebSocket socket) {
            try {
                // When a new client connects we add them to the connections, though they are not signed in, so we don't add a client
                connections.Add(socket);
                int hash = socket.GetHashCode();
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
                    await recivedMessage(payload, socket);
                }
                await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                connections.Remove(socket);
                clients.Remove(hash);
            } catch (Exception e) {

            }
        }

        async Task recivedMessage(ClientPayload message, WebSocket socket) {
            // First we check if this is a Login call, since they're always allowed
            if (message.type == ClientPayloadType.Login) {
                var newStatus = LoginManager.login(message.payload);
                if (newStatus == null) {
                    var response = new ClientPayload(ClientPayloadType.Error, "Wrong login info");
                    await sendPayload(response, socket);
                } else {
                    // Now we're signed in, so we create a client
                    
                }
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
        private String id;

        
    }
}