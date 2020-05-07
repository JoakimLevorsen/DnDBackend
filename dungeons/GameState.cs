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

                List<int> campaignIDs = myCharacters
                    .Where(c => c.campaign != null)
                    .Select(c => c.campaign!.ID)
                    .ToList();

                var joinedCampaigns = await context.campaigns
                    .Include("dungeonMaster")
                    .Where(c => campaignIDs.Contains(c.ID))
                    .ToListAsync();

                var ownedCampaigns = await context.campaigns
                    .Include("dungeonMaster")
                    .Where(c => c.dungeonMaster.ID == me.ID)
                    .ToListAsync();

                campaignIDs.AddRange(ownedCampaigns.Select(c => c.ID));

                var allCharactersEncountered = await context.characters
                    .Include("owner")
                    .Include("campaign")
                    .Include("cClass")
                    .Include("cRace")
                    .Where(c => campaignIDs.Contains(c.campaign == null ? -1 : c.campaign.ID))
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

                var joinedCampaignsToInclude = joinedCampaigns.Where(c => c.dungeonMaster != null).ToList();

                return JsonConvert.SerializeObject(new
                {
                    myCharacters = myCharacters.Select(c => new
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
                    // Where-clause ensures list of encountered characters doesn't include one's own characters
                    encounteredCharacters = allCharactersEncountered
                        .Where(c => c.owner.ID != me.ID)
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
                    joinedCampaigns = joinedCampaigns
                        .Where(c => c.dungeonMaster != null)
                        .Select(c => new
                        {
                            ID = c.ID,
                            name = c.name,
                            log = c.log,
                            turnIndex = c.turnIndex,
                            joinable = c.joinable,
                            maxPlayers = c.maxPlayers,
                            password = c.password ?? null,
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