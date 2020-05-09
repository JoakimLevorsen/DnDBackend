using dungeons.database;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace dungeons
{
    enum CharacterMessageType
    {
        create,
        delete,
        update,
    }

    class CharacterMessage
    {
        public CharacterMessageType type;
        public string payload;
    }

    class CharacterManager
    {
        public static async Task<string> accept(string payload, Client client)
        {
            CharacterMessage? message;
            try
            {
                message = JsonConvert.DeserializeObject<CharacterMessage>(payload, new StringEnumConverter());
            }
            catch
            {
                return "CharacterManager accept 0: Invalid JSON";
            }
            if (message == null)
            {
                return "CharacterManager accept 1: Null message";
            }
            switch (message.type)
            {
                case CharacterMessageType.create:
                    return await create(message.payload, client);
                case CharacterMessageType.delete:
                    return await delete(message.payload, client);
                case CharacterMessageType.update:
                    return await update(message.payload, client);
            }
            // This should literally never happen
            return "CharacterManager accept ::: Internal error";
        }

        private class CreatePayload
        {
            public string name;
            public string race;
            public string characterClass;
        }

        private static async Task<string> create(string payload, Client client)
        {
            CreatePayload message;
            try
            {
                message = JsonConvert.DeserializeObject<CreatePayload>(payload);
            }
            catch
            {
                return "CharacterManager create 2: Null message";
            }
            using (var context = GameContext.getNew())
            {
                var race = await context.characterRaces.FindAsync(message.race);
                if (race == null)
                {
                    return "CharacterManager create 3: Race not found";
                }
                var cClass = await context.characterClasses.FindAsync(message.characterClass);
                if (cClass == null)
                {
                    return "CharacterManager create 4: Class not found, valid options are " + string.Join(',', (await context.characterClasses.ToListAsync()).Select(c => c.name).ToArray());
                }
                // We get the client user again because it is from another context
                var user = await context.users.FindAsync(client.user.ID);
                var newCharacter = new Character
                {
                    name = message.name,
                    health = 10,
                    xp = 0,
                    cClass = cClass,
                    cRace = race,
                    owner = user
                };
                context.characters.Add(newCharacter);
                await context.SaveChangesAsync();
                return await GameState.gameStateFor(client);
            }
        }

        private static async Task<string> delete(string id, Client client)
        {
            int idToUse;
            try
            {
                idToUse = Int32.Parse(id);
            }
            catch
            {
                return "CharacterManager delete 5: Id is not a number";
            }
            using (var context = GameContext.getNew())
            {
                Character characterToDelete;
                try
                {
                    characterToDelete = await context.characters
                        .Include("owner")
                        .SingleAsync(c => c.ID == idToUse);
                }
                catch
                {
                    return "CharacterManager delete 6: This character does not exist";
                }
                context.characters.Remove(characterToDelete);
                await context.SaveChangesAsync();
                return await GameState.gameStateFor(client);
            }
        }

        private class UpdatePayload
        {
            public int ID;
            public string? name;
            public int? xp;
            public int? health;
        }

        private static async Task<string> update(string payload, Client client)
        {
            UpdatePayload updatePayload;
            try
            {
                updatePayload = JsonConvert.DeserializeObject<UpdatePayload>(payload);
            }
            catch
            {
                return "CharacterManager update 8: Non valid JSON";
            }
            using (var context = GameContext.getNew())
            {
                Character characterToUpdate;
                try
                {
                    characterToUpdate = await context.characters
                        .Where(c => c.ID == updatePayload.ID)
                        .Include(c => c.owner)
                        .Include(c => c.campaign)
                        .ThenInclude(campaign => campaign.dungeonMaster)
                        .SingleAsync();
                }
                catch
                {
                    return $"CharacterManager update 9: Character with ID { updatePayload.ID } does not exist";
                }
                if (updatePayload.name != null)
                {
                    if (characterToUpdate.owner.ID != client.user.ID)
                    {
                        return "CharacterManager update 10: Only the owner can change name";
                    }
                    characterToUpdate.name = updatePayload.name;
                    context.characters.Update(characterToUpdate);
                    await context.SaveChangesAsync();
                }
                else
                {
                    if (characterToUpdate.campaign == null)
                    {
                        return "CharacterManager update 11: Can't change these things yet man";
                    }
                    var dungeonMasterID = characterToUpdate.campaign.dungeonMaster.ID;


                    if (dungeonMasterID != client.user.ID)
                    {
                        return "CharacterManager update 12: You have no power here";
                    }
                    characterToUpdate.xp = updatePayload.xp ?? characterToUpdate.xp;
                    characterToUpdate.health = updatePayload.health ?? characterToUpdate.health;
                    context.characters.Update(characterToUpdate);
                    await context.SaveChangesAsync();
                }
                if (characterToUpdate.campaign != null)
                {
                    List<string> clientIdsToUpdate = new List<string>();
                    clientIdsToUpdate.Add(characterToUpdate.campaign.dungeonMaster.ID);
                    var charactersInCampaign = await context.characters
                        .Include("campaign")
                        .Include("owner")
                        .Where(c => c.campaign != null && c.campaign.ID == characterToUpdate.campaign.ID)
                        .Select(c => c.owner.ID)
                        .ToListAsync();
                    clientIdsToUpdate.Concat(charactersInCampaign);
                    foreach (var clientID in clientIdsToUpdate)
                    {
                        await ClientManager.GetInstance().sendGameState(clientID);
                    }
                }
                return await GameState.gameStateFor(client);
            }
        }
    }
}