using System.ComponentModel.DataAnnotations;

namespace dungeons.database
{
    public class CharacterRace
    {
        [Key]
        public string name { get; set; }
    }
}