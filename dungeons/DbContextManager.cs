using Microsoft.EntityFrameworkCore;
using dungeons.database;

namespace dungeons
{
    public class DbContextManager
    {
        private static string _connectionString = "server=localhost;port=3306;database=DnD;user=root;password=12345678";

        private static database.GameContext? context;

        private static DbContextOptions<GameContext>? DbContextOptions;

        public static DbContextOptions<GameContext> getOptions()
        {
            if (DbContextOptions == null)
            {
                DbContextOptions = new DbContextOptionsBuilder<database.GameContext>()
                    // .UseSqlServer(_connectionString)
                    .Options;
            }
            return DbContextOptions;
        }
    }
}