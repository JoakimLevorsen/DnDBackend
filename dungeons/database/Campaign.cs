using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace dungeons.database
{
    public class Campaign
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string name { get; set; }
        public string log { get; set; }
        public int turnIndex { get; set; }
        public bool joinable { get; set; }
        public int maxPlayers { get; set; }
        public string? password { get; set; }
        public DateTime modificationDate { get; set; }

        public User dungeonMaster { get; set; }
        public async Task<List<Character>> players()
        {
            using (var context = new GameContext())
            {
                return await context.characters.Where(c => c.campaign != null && c.campaign.ID == this.ID).ToListAsync();
            }
        }
    }
}