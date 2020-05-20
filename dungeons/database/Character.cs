using System.ComponentModel.DataAnnotations.Schema;

namespace dungeons.database
{
    public class Character
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public string name { get; set; }
        public int health { get; set; }
        public int xp { get; set; }
        public int? turnIndex { get; set; }

        public User owner { get; set; }
        public CharacterClass cClass { get; set; }
        public CharacterRace cRace { get; set; }
        public Campaign? campaign { get; set; }

        public Character(
            string name,
            int health,
            int xp,
            int? turnIndex,
            User owner,
            CharacterClass cClass,
            CharacterRace cRace,
            Campaign? campaign
        )
        {
            this.name = name;
            this.health = health;
            this.xp = xp;
            this.turnIndex = turnIndex;
            this.owner = owner;
            this.cClass = cClass;
            this.cRace = cRace;
            this.campaign = campaign;
        }
    }
}