using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using dungeons.database;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;

namespace dungeons {
    class CampaignManager {
        public static Task<database.Campaign> accept(string payload, Client client) {
            var context = DbContextManager.getSharedInstance();
            var message = JsonConvert.DeserializeObject<CampaignMessagePayload>(payload);
            if (message == null) {
                //TODO: Return error.
                return;
            }
            switch (message.type)
            {
                case CampaignMessagePayloadType.Create:
                    return create(message.payload, client, context);
                    break;
                case CampaignMessagePayloadType.Update:
                    return update(message.payload, client, context);
                    break;
                case CampaignMessagePayloadType.Delete:
                    return delete(message.payload, client, context);
                    break;
                case CampaignMessagePayloadType.Get:
                    return get(message.payload, client, context);
                    break;
                case CampaignMessagePayloadType.GetMy:
                    return getMy(message.payload, client, context);
                    break;
                default:
                    break;
            }
        }

        public static Task<database.Campaign> create(string payload, Client client, database.GameContext context) {
            var info = JsonConvert.DeserializeObject<CreateCampaignPayload>(payload);
            var newCampaign = info.toReturn();
            newCampaign.dungeonMaster = client.user;
            context.campaigns.Add(newCampaign);
            context.SaveChanges();
            return newCampaign;
        }

        public static async Task<database.Campaign> update(string payload, Client client, database.GameContext context) {
            var updates = JsonConvert.DeserializeObject<UpdateCampaignPayload>(payload);
            var campaign = await context.campaigns.SingleAsync(c => c.ID == updates.id);
            if (client.user.ID == campaign.dungeonMaster.ID) {
                campaign.name = updates.name;
                campaign.log = updates.log;
                campaign.turnIndex = updates.turnIndex;
                campaign.joinable = updates.joinable;
                campaign.maxPlayers = updates.maxPlayers;
                campaign.password = updates.password;
                campaign.modificationDate = DateTime.Now;
                context.campaigns.Update(campaign);
                context.SaveChanges();
            }
            return campaign;
        }

        public static Task<database.Campaign> delete(string payload, Client client, database.GameContext context) {
            var info = JsonConvert.DeserializeObject<DeleteCampaignPayload>(payload);
            context.Remove(context.campaigns.Single(c => c.ID == info.ID));
            context.SaveChanges();
        }

        public static async Task<database.Campaign> get(string payload, Client client, database.GameContext context) {
            var info = JsonConvert.DeserializeObject<GetCampaignPayload>(payload);
            var campaign = await context.campaigns.SingleAsync(c => c.ID == info.id);
            return campaign;
        }
    
        public static async Task<database.Campaign> getMy(string payload, Client client, database.GameContext context) {
            var info = JsonConvert.DeserializeObject<GetMyCampaignsPayload>(payload);
            var myCampaigns = await context.campaigns.Where(c => c.ID == info.id).ToList();
            return myCampaigns;
        }
    }

    class CampaignMessagePayload {
        public CampaignMessagePayloadType type;
        public string payload;

        public CampaignMessagePayload(CampaignMessagePayloadType type, string payload) {
            this.type = type;
            this.payload = payload;
        }
    }

    enum CampaignMessagePayloadType
    {
        Create,
        Update,
        Delete,
        Get,
        GetMy
    }

    class CreateCampaignPayload {
        public string name;
        public bool joinable;
        public int maxPlayers;
        public string? password;

        public database.Campaign toReturn() {
            var campaign = new database.Campaign();
            campaign.name = this.name;
            campaign.log = $"Campaign {campaign.name} was created.";
            campaign.turnIndex = 0;
            campaign.joinable = this.joinable;
            campaign.maxPlayers = this.maxPlayers;
            campaign.password = this.password;
            campaign.modificationDate = DateTime.Now;
            return campaign;
        }
    }

    class UpdateCampaignPayload {
        public int ID;
        public string name;
        public string log;
        public int turnIndex;
        public bool joinable;
        public int maxPlayers;
        public string? password;

        /* Not currently in use:

        public database.Campaign toReturn() {
            var campaign = new database.Campaign();
            campaign.ID = this.ID;
            campaign.name = this.name;
            campaign.log = this.log;
            campaign.turnIndex = this.turnIndex;
            campaign.joinable = this.joinable;
            campaign.maxPlayers = this.maxPlayers;
            campaign.password = this.password;
            campaign.modificationDate = DateTime.Now;
            return campaign;
        }*/
    }
    
    class DeleteCampaignPayload {
        public int ID;
    }

    class GetCampaignPayload {
        public int ID;
    }

    class GetMyCampaignsPayload {
        public string userID;
    }
}