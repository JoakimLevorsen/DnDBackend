using System.ComponentModel.DataAnnotations;

namespace dungeons.database {
    public class CharacterRace {
        [Key]
        public int name { get; set; }
    }
}