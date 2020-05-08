using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using dungeons.database;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Collections.Generic;

namespace dungeons
{
    class CampaignManager
    {
        public static async Task<string> accept(string payload, Client client)
        {
            using (var context = GameContext.getNew())
            {
                CampaignMessagePayload? message;
                try
                {
                    message = JsonConvert.DeserializeObject<CampaignMessagePayload>(payload, new StringEnumConverter());
                }
                catch
                {
                    return "CampaignManager accept 0: Invalid JSON.";
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
                    case CampaignMessagePayloadType.JoinCampaign:
                        return await joinCampaign(message.payload, client, context);
                    default:
                        return "CampaignManager accept 2: Message type not found.";
                }
            }
        }

        private static async Task<string> create(string payload, Client client, GameContext context)
        {
            CreateCampaignPayload message;
            try
            {
                message = JsonConvert.DeserializeObject<CreateCampaignPayload>(payload, new StringEnumConverter())!;
            }
            catch
            {
                return "CampaignManager create 3: Invalid JSON.";
            }
            if (message.name == null)
            {
                return "CampaignManager create 4: Must include a name";
            }
            // We get the client user again because it is from another context
            var user = await context.users.FindAsync(client.user.ID);
            var newCampaign = new Campaign
            {
                name = message.name,
                log = $"Campaign {message.name} was created.",
                turnIndex = 0,
                joinable = message.joinable,
                maxPlayers = message.maxPlayers,
                password = message.password,
                modificationDate = DateTime.Now,
                dungeonMaster = user
            };
            context.campaigns.Add(newCampaign);
            await context.SaveChangesAsync();
            return await GameState.gameStateFor(client);
        }

        private static async Task<string> update(string payload, Client client, GameContext context)
        {
            UpdateCampaignPayload? message;
            try
            {
                message = JsonConvert.DeserializeObject<UpdateCampaignPayload>(payload, new StringEnumConverter());
            }
            catch
            {
                return "CampaignManager update 5: Invalid JSON.";
            }
            if (message == null)
            {
                return "CampaignManager update 6: Null message.";
            }
            Campaign campaignToUpdate;
            try
            {
                campaignToUpdate = await context.campaigns
                    .Include("dungeonMaster")
                    .SingleAsync(c => c.ID == message.ID);
            }
            catch
            {
                return "CampaignManager update 7: Campaign not found.";
            }
            if (client.user.ID == campaignToUpdate.dungeonMaster.ID)
            {
                campaignToUpdate.name = message.name;
                campaignToUpdate.log = message.log;
                campaignToUpdate.turnIndex = message.turnIndex;
                campaignToUpdate.joinable = message.joinable;
                campaignToUpdate.maxPlayers = message.maxPlayers;
                campaignToUpdate.password = message.password;
                campaignToUpdate.modificationDate = DateTime.Now;
                context.campaigns.Update(campaignToUpdate);
                await context.SaveChangesAsync();
            }
            else return "CampaignManager update 8: You are not the Dungeon Master for this campaign.";
            // We also send a new gameState to the other players (we know it's everyone but the dungeon master)
            List<string> clientIdsToUpdate = new List<string>();
            clientIdsToUpdate.Add(campaignToUpdate.dungeonMaster.ID);
            var charactersInCampaign = await context.characters
                .Include("owner")
                .Where(c => c.campaign != null && c.campaign.ID == campaignToUpdate.ID)
                .Select(c => c.owner.ID)
                .ToListAsync();
            clientIdsToUpdate.Concat(charactersInCampaign);
            foreach (var clientID in clientIdsToUpdate)
            {
                await ClientManager.GetInstance().sendGameState(clientID);
            }
            return await GameState.gameStateFor(client);
        }

        private static async Task<string> delete(string ID, Client client, GameContext context)
        {
            int IDToUse = Convert.ToInt32(ID);
            Campaign? campaignToDelete;
            try
            {
                campaignToDelete = await context.campaigns
                    .Include("dungeonMaster")
                    .SingleAsync(c => c.ID == IDToUse);
            }
            catch
            {
                return "CampaignManager delete 9: Campaign not found.";
            }
            if (campaignToDelete == null) return "CampaignManager delete 10: This campaign does not exist.";
            if (campaignToDelete.dungeonMaster.ID == client.user.ID)
            {
                context.campaigns.Remove(campaignToDelete);
                await context.SaveChangesAsync();
                return await GameState.gameStateFor(client);
            }
            else return "CampaignManager delete 11: You are not the Dungeon Master for this campaign.";
        }

        private static async Task<string> get(string ID, Client client, GameContext context)
        {
            int IDToUse = Convert.ToInt32(ID);
            Campaign campaign;
            try
            {
                campaign = await context.campaigns.SingleAsync(c => c.ID == IDToUse);
            }
            catch
            {
                return "CampaignManager get 12: Campaign not found.";
            }
            return JsonConvert.SerializeObject(campaign);
        }

        private static async Task<string> getJoinable(Client client, GameContext context)
        {
            var joinableCampaigns = await context.campaigns.Where(c => c.joinable == true).ToListAsync();
            if (joinableCampaigns.Count() == 0) return "CampaignManager getJoinable 13: No joinable campaigns.";
            else return JsonConvert.SerializeObject(joinableCampaigns);
        }

        private static async Task<string> joinCampaign(string payload, Client client, GameContext context)
        {
            JoinCampaignPayload? message;
            try
            {
                message = JsonConvert.DeserializeObject<JoinCampaignPayload>(payload, new StringEnumConverter());
            }
            catch
            {
                return "CampaignManager joinCampaign 14: Invalid JSON.";
            }
            if (message == null)
            {
                return "CampaignManager joinCampaign 15: Null message.";
            }

            Character? joiningCharacter;
            try
            {
                joiningCharacter = await context.characters.SingleAsync(c => c.ID == message.joiningCharacterID);
            }
            catch
            {
                return "CampaignManager joinCampaign 16: Character not found.";
            }

            if (joiningCharacter.campaign != null) return "CampaignManager joinCampaign 17: Character is already a part of a campaign.";

            Campaign? campaignToJoin;
            try
            {
                campaignToJoin = await context.campaigns.SingleAsync(c => c.ID == message.campaignToJoinID);
            }
            catch
            {
                return "CampaignManager joinCampaign 18: Campaign not found.";
            }
            if (!campaignToJoin.joinable) return "CampaignManager joinCampaign 19: This campaign is not joinable.";

            if (campaignToJoin.password != null)
            {
                if (campaignToJoin.password != message.password)
                {
                    return "CampaignManager joinCampaign 20: Wrong password.";
                }
            }

            joiningCharacter.campaign = campaignToJoin;
            context.characters.Update(joiningCharacter);
            await context.SaveChangesAsync();

            var numOfCharactersInCampaign = await context.characters.Include("campaign").Where(c => c.campaign != null && c.campaign.ID == campaignToJoin.ID).CountAsync();
            if (numOfCharactersInCampaign >= campaignToJoin.maxPlayers)
            {
                campaignToJoin.joinable = false;
                context.campaigns.Update(campaignToJoin);
                await context.SaveChangesAsync();
            }
            return await GameState.gameStateFor(client);
        }
    }

    class CampaignMessagePayload
    {
        public CampaignMessagePayloadType type;
        public string payload;

        public CampaignMessagePayload(CampaignMessagePayloadType type, string payload)
        {
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
        GetJoinable,
        JoinCampaign
    }

    class CreateCampaignPayload
    {
        public string name;
        public bool joinable;
        public int maxPlayers;
        public string? password;
    }

    class UpdateCampaignPayload
    {
        public int ID;
        public string name;
        public string log;
        public int turnIndex;
        public bool joinable;
        public int maxPlayers;
        public string? password;
    }

    class JoinCampaignPayload
    {
        public int campaignToJoinID;
        public int joiningCharacterID;
        public string? password;
    }
}
