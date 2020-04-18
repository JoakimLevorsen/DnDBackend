using System.ComponentModel.DataAnnotations;

namespace dungeons.database {
    public class CharacterClass {
        [Key]
        public int name { get; set; }
    }
}