namespace dungeons.database {
    public class Character {
        public int ID { get; set; }
        public string name { get; set; }
        public int health { get; set; }
        public int xp { get; set; }
        public int turnIndex { get; set; }

        public User owner { get; set; }
        public CharacterClass cClass { get; set; }
        public CharacterRace cRace { get; set; }
        public Campaign? campaign { get; set; }
    }
}