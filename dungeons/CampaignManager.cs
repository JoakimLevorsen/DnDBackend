using Newtonsoft.Json;
using dungeons.database;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace dungeons {
    class CampaignManager {
        public static async Task<string> accept(string payload, Client client) {
            var context = DbContextManager.getSharedInstance();
            var message = JsonConvert.DeserializeObject<CampaignMessagePayload>(payload);
            if (message == null) {
                return "CampaignManager accept 1: Null message";
            }
            switch (message.type)
            {
                case CampaignMessagePayloadType.Create:
                    return await create(message.payload, client, context);
                case CampaignMessagePayloadType.Update:
                    return await update(message.payload, client, context);
                case CampaignMessagePayloadType.Delete:
                    return await delete(message.payload, client, context);
                case CampaignMessagePayloadType.Get:
                    return await get(message.payload, client, context);
                case CampaignMessagePayloadType.GetJoinable:
                    return await getJoinable(client, context);
                default:
                    return "CampaignManager accept 2: Message type does not exist.";
            }
        }

        private static async Task<string> create(string payload, Client client, GameContext context) {
            var message = JsonConvert.DeserializeObject<CreateCampaignPayload>(payload);
            if (message == null) {
                return "CampaignManager create 3: Null message";
            }
            var newCampaign = new Campaign {
                name = message.name,
                log = $"Campaign {message.name} was created.",
                turnIndex = 0,
                joinable = message.joinable,
                maxPlayers = message.maxPlayers,
                password = message.password,
                modificationDate = DateTime.Now,
                dungeonMaster = client.user
            };
            context.campaigns.Add(newCampaign);
            await context.SaveChangesAsync();
            return JsonConvert.SerializeObject(newCampaign);
        }

        private static async Task<string> update(string payload, Client client, GameContext context) {
            var message = JsonConvert.DeserializeObject<UpdateCampaignPayload>(payload);
            if (message == null) {
                return "CampaignManager update 4: Null message";
            }
            var campaignToUpdate = await context.campaigns.Include("dungeonMaster").SingleAsync(c => c.ID == message.ID);
            if (client.user.ID == campaignToUpdate.dungeonMaster.ID) {
                campaignToUpdate.name = message.name;
                campaignToUpdate.log = message.log;
                campaignToUpdate.turnIndex = message.turnIndex;
                campaignToUpdate.joinable = message.joinable;
                campaignToUpdate.maxPlayers = message.maxPlayers;
                campaignToUpdate.password = message.password;
                campaignToUpdate.modificationDate = DateTime.Now;
                context.campaigns.Update(campaignToUpdate);
                await context.SaveChangesAsync();
            } else return "CampaignManager update 5: You are not the Dungeon Master for this campaign.";
            return JsonConvert.SerializeObject(campaignToUpdate);
        }

        private static async Task<string> delete(string ID, Client client, GameContext context) {
            int IDToUse = Convert.ToInt32(ID);
            var campaignToDelete = await context.campaigns.Include("dungeonMaster").SingleAsync(c => c.ID == IDToUse);
            if (campaignToDelete == null) return "CampaignManager delete 6: This campaign does not exist.";
            if (campaignToDelete.dungeonMaster.ID == client.user.ID) {
                context.campaigns.Remove(campaignToDelete);
                await context.SaveChangesAsync();
                return "Campaign deleted.";
            } else return "CampaignManager delete 7: You are not the Dungeon Master for this campaign.";
        }

        private static async Task<string> get(string ID, Client client, GameContext context) {
            int IDToUse = Convert.ToInt32(ID);
            var campaign = await context.campaigns.SingleAsync(c => c.ID == IDToUse);
            if (campaign == null) return "CampaignManager get 8: This campaign does not exist.";
            else return JsonConvert.SerializeObject(campaign);
        }

        private static async Task<string> getJoinable(Client client, GameContext context) {
            var joinableCampaigns = await context.campaigns.Where(c => c.joinable == true).ToListAsync();
            if (joinableCampaigns.Count() == 0) return "CampaignManager getJoinable 9: No joinable campaigns.";
            else return JsonConvert.SerializeObject(joinableCampaigns);
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
        GetJoinable
    }

    class CreateCampaignPayload {
        public string name;
        public bool joinable;
        public int maxPlayers;
        public string? password;
    }

    class UpdateCampaignPayload {
        public int ID;
        public string name;
        public string log;
        public int turnIndex;
        public bool joinable;
        public int maxPlayers;
        public string? password;
    }
}
