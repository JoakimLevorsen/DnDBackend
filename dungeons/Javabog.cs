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
        TODO Set path variable (clint.GetAsync): "http://localhost:8080" OR SOMETHING GOD DAMN ELSE
                BTW, path to AWS is: http://ec2-3-21-41-28.us-east-2.compute.amazonaws.com:8080
        TODO REMEMBER to change "hostname" variable in RestfulGalgeleg (jar files)
        TODO Actaully call Login method somewhere
                CURRENLT GIVES Wierd output: 
                
                    System.Runtime.CompilerServices.AsyncTaskMethodBuilder`1+AsyncStateMachineBox`1[System.String,dungeons.Javabog+<Login>d__2]

                    ... Fix later
        */
        static HttpClient client = new HttpClient();
        static UriBuilder baseUri = new UriBuilder("http://ec2-3-21-41-28.us-east-2.compute.amazonaws.com:8080/login?");
        public static async Task<string> Login(string username, string password)
        {
            string queryToAppend = "username=" + username + "&password=" + password;
            baseUri.Query = queryToAppend;

            var response = await client.GetAsync(baseUri.Uri);

            string result = await response.Content.ReadAsStringAsync();
            return result;
        }
    }
}