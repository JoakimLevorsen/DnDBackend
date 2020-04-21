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
        /*
        NOTE PLEASE:
        Set path variable (baseUri + queryToAppend): "http://localhost:8080" or the appropriate PATH
                Path to AWS is: http://ec2-3-21-41-28.us-east-2.compute.amazonaws.com:8080
        REMEMBER to change "hostname" variable in RestfulGalgeleg (jar files) if we move it from AWS
        */
        static HttpClient client = new HttpClient();
        static UriBuilder baseUri = new UriBuilder("http://ec2-3-21-41-28.us-east-2.compute.amazonaws.com:8080/login?");
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