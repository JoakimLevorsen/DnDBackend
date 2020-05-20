using Microsoft.EntityFrameworkCore;
#nullable disable warnings
namespace dungeons.database
{
    public class GameContext : DbContext
    {
        public static GameContext getNew()
        {
            return new GameContext();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite("Data Source=blogging.db");

        public DbSet<Campaign> campaigns { get; set; }
        public DbSet<Character> characters { get; set; }
        public DbSet<CharacterClass> characterClasses { get; set; }
        public DbSet<CharacterRace> characterRaces { get; set; }
        public DbSet<DiceRoll> diceRolls { get; set; }
        public DbSet<User> users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Campaign>().ToTable("Campaign");
            modelBuilder.Entity<Character>().ToTable("Character");
            modelBuilder.Entity<CharacterClass>().ToTable("CharacterClass");
            modelBuilder.Entity<CharacterRace>().ToTable("CharacterRace");
            modelBuilder.Entity<DiceRoll>().ToTable("DiceRoll");
            modelBuilder.Entity<User>().ToTable("User");
        }
    }
}