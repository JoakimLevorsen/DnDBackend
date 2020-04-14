using System;
using System.Net;
using System.Xml;
using System.IO;

namespace dungeons
{
    class Javabog
    {
        public static void Login(string loginnavn, string kode)
        {
            HttpWebRequest request = CreateWebRequest();
            XmlDocument soapEnvelopeXml = new XmlDocument();
            soapEnvelopeXml.LoadXml(
                @"<?xml version=""1.0"" encoding=""utf-8""?>
                <soap:Envelope 
                    xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" 
                    xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" 
                    xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
                  <soap:Body>
                    <hentBruger xmlns=""http://javabog.dk:9901/brugeradmin?wsdl"">
                            <brugernavn>loginnavn</brugernavn>
                            <adgangskode>kode</adgangskode>                  
                    </soap:Body>
                </soap:Envelope>");

            using (Stream stream = request.GetRequestStream())
            {
                soapEnvelopeXml.Save(stream);
            }

            using (WebResponse response = request.GetResponse())
            {
                using (StreamReader rd = new StreamReader(response.GetResponseStream()))
                {
                    string soapResult = rd.ReadToEnd();
                    Console.WriteLine(soapResult);
                }
            }
        }

        public static HttpWebRequest CreateWebRequest()
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(@"http://javabog.dk:9901/brugeradmin?wsdl");
            webRequest.Headers.Add(@"SOAP:Action");
            webRequest.ContentType = "text/xml;charset=\"utf-8\"";
            webRequest.Accept = "text/xml";
            webRequest.Method = "POST";
            return webRequest;
        }
    }
}