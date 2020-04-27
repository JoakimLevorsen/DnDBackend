using System.ComponentModel.DataAnnotations;

namespace dungeons.database
{
    public class CharacterClass
    {
        [Key]
        public string name { get; set; }
    }
}