using System.Threading.Tasks;
using Newtonsoft.Json;

namespace dungeons {
    public class LoginManager {
        public static async Task<LoginClientPayload?> login(string payload) {
            try {
                var loginInfo = JsonConvert.DeserializeObject<LoginClientPayload>(payload);
                var response = await Javabog.Login(loginInfo.username, loginInfo.password);
                if (response) {
                    return loginInfo;
                }
                return null;
            } catch {
                return null;
            }
        }
    }

    public class LoginClientPayload {
        public string username;
        public string password;
    }
}