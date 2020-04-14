using System.Threading.Tasks;
using Newtonsoft.Json;

namespace dungeons {
    public class LoginManager {
        public static async Task<LoginManagerReturn> login(string payload) {
            try {
                var loginInfo = JsonConvert.DeserializeObject<LoginClientPayload>(payload);
                await Task.Delay(100);
                return loginInfo.toReturn();
            } catch {
                return null;
            }
        }
    }

    class LoginClientPayload {
        public string username;
        public string password;

        public LoginManagerReturn toReturn() {
            var r = new LoginManagerReturn();
            r.username = this.username;
            r.password = this.password;
            return r;
        }
    }

    public class LoginManagerReturn {
        public string username;
        public string password;
    }
}