using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;
using dungeons.database;

namespace dungeons
{

    class DiceRollManager
    {
        private class DiceRollPayload
        {
            public int diceType;
            public int campaignID;
        }

        public static async Task<string> accept(string payload, Client client)
        {
            DiceRollPayload message;
            try
            {
                message = JsonConvert.DeserializeObject<DiceRollPayload>(payload);
            }
            catch
            {
                return "DiceRollManager accept 0: Ya done did goof'd";
            }
            using (var context = GameContext.getNew())
            {
                Campaign campaign;
                try
                {
                    campaign = await context.campaigns
                        .Include(c => c.dungeonMaster)
                        .Where(c => c.ID == message.campaignID)
                        .SingleAsync();
                }
                catch
                {
                    return "DiceRollManager accept 1: Campaign not found";
                }
                if (message.diceType < 4 || message.diceType > 20)
                {
                    return "DiceRollManager accept 2: Hvad fanden laver du din prut (wrong diceType)";
                }
                var rnd = new Random();
                var roll = new DiceRoll
                (
                    message.diceType,
                    rnd.Next(1, message.diceType + 1),
                    DateTime.Now,
                    campaign
                );
                await context.diceRolls.AddAsync(roll);
                await context.SaveChangesAsync();
                var charactersInCampaign = await context.characters
                    .Include(c => c.campaign)
                    .Include(c => c.owner)
                    .Where(c => c.campaign != null && c.campaign.ID == campaign.ID)
                    .Select(c => c.owner.ID)
                    .ToListAsync();
                string dicePayload = JsonConvert.SerializeObject(new
                {
                    diceType = roll.diceType,
                    roll = roll.roll,
                    date = roll.date,
                    campaign = roll.campaign.ID
                });
                charactersInCampaign.Add(campaign.dungeonMaster.ID);
                foreach (var c in charactersInCampaign)
                {
                    await ClientManager.GetInstance().sendPayload(dicePayload, c);
                }
                return await GameState.gameStateFor(client);
            }
        }
    }
}