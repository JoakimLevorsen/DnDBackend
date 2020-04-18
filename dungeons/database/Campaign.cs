using System;

namespace dungeons.database {
    public class Campaign {
        public int ID { get; set; }
        public string name { get; set; }
        public string log { get; set; }
        public int turnIndex { get; set; }
        public bool joinable { get; set; }
        public int maxPlayers { get; set; }
        public string? password { get; set; }
        public DateTime modificationDate { get; set; }
        
        public User dungeonMaster { get; set; }
    }
}