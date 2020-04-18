using System;

namespace dungeons.database {
    public class DiceRoll {
        public int ID { get; set; }
        public int diceType { get; set; }
        public DateTime date { get; set; }
        public Campaign campaign { get; set; }
    }
}