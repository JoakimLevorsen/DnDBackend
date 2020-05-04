using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.IO;
using System.Threading.Tasks;


namespace dungeons
{
    public class Javabog
    {
        static HttpClient client = new HttpClient();
        // NOTE: "http://localhost:8080/login?"
        // NOTE: "130.225.170.238:8080/login?"
        static UriBuilder baseUri = new UriBuilder("130.225.170.238:8080/login?");
        public static async Task<Boolean> Login(string username, string password)
        {
            string queryToAppend = $"username={ username }&password={ password }";
            baseUri.Query = queryToAppend;

            var response = await client.GetAsync(baseUri.Uri);

            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Login result: { result }");
            return result == "true";
        }
    }
}