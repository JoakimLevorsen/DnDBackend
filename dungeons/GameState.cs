using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using dungeons.database;
using Newtonsoft.Json;

namespace dungeons
{
    public class GameState
    {
        public static async Task<string> gameStateFor(Client client)
        {
            using (var context = GameContext.getNew())
            {
                var me = await context.users.FindAsync(client.user.ID);
                var myCharacters = await context.characters
                    .Include("owner")
                    .Include("campaign")
                    .Include("cClass")
                    .Include("cRace")
                    .Where(c => c.owner.ID == me.ID)
                    .ToListAsync();
                List<Campaign> joinedCampaigns = myCharacters
                    .Select(c => c.campaign)
                    .Where(c => c != null)
                    .ToList() ?? new List<Campaign>()!;

                var ownedCampaigns = await context.campaigns
                    .Include("dungeonMaster")
                    .Where(c => c.dungeonMaster.ID == me.ID)
                    .ToListAsync();
                List<int> campaignIds = new List<int>();

                campaignIds.Concat(joinedCampaigns.Select(c => c.ID));
                campaignIds.Concat(ownedCampaigns.Select(c => c.ID));

                var allCharactersEncountered = await context.characters
                    .Include("owner")
                    .Include("campaign")
                    .Include("cClass")
                    .Include("cRace")
                    .Where(c => campaignIds.Contains(c.campaign == null ? -1 : c.campaign.ID))
                    .ToListAsync();

                Dictionary<int, List<DiceRoll>> rolls = new Dictionary<int, List<DiceRoll>>();
                foreach (var c in ownedCampaigns)
                {
                    rolls[c.ID] = await context.diceRolls
                        .Include("campaign")
                        .Where(d => d.campaign.ID == c.ID)
                        .Take(5)
                        .ToListAsync();

                }
                foreach (var c in joinedCampaigns)
                {
                    rolls[c.ID] = await context.diceRolls
                        .Include("campaign")
                        .Where(d => d.campaign.ID == c.ID)
                        .Take(5)
                        .ToListAsync();
                }

                return JsonConvert.SerializeObject(new
                {
                    // We add the remaining characters that were not part of a campaign
                    characters = allCharactersEncountered
                        .Concat(myCharacters.Where(c => c.campaign == null))
                        .Select(c => new
                        {
                            owner = c.owner.ID,
                            campaign = c.campaign == null ? -1 : c.campaign.ID,
                            cRace = c.cRace.name,
                            cClass = c.cClass.name,
                            name = c.name,
                            ID = c.ID,
                            health = c.health,
                            xp = c.xp,
                            level = Math.Floor(Convert.ToDouble(c.xp) / 1000),
                            turnIndex = c.turnIndex
                        }),
                    diceRolls = rolls,
                    me = me.ID,
                    ownedCampaigns = ownedCampaigns.Select(c => new
                    {
                        ID = c.ID,
                        name = c.name,
                        log = c.log,
                        turnIndex = c.turnIndex,
                        joinable = c.joinable,
                        maxPlayers = c.maxPlayers,
                        password = c.password,
                        modificationDate = c.modificationDate
                            .ToUniversalTime()
                            .ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'"),
                        dungeonMaster = c.dungeonMaster.ID
                    }),
                    joinedCampaigns = joinedCampaigns.Select(c => new
                    {
                        ID = c.ID,
                        name = c.name,
                        log = c.log,
                        turnIndex = c.turnIndex,
                        joinable = c.joinable,
                        maxPlayers = c.maxPlayers,
                        password = c.password,
                        modificationDate = c.modificationDate
                            .ToUniversalTime()
                            .ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'Z'"),
                        dungeonMaster = c.dungeonMaster.ID
                    }),
                });
            }
        }
    }

}