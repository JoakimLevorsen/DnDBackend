using Microsoft.EntityFrameworkCore;

namespace dungeons
{
    public class DbContextManager
    {
        private static string _connectionString = "Server=(localdb)\\mssqllocaldb;Database=Dungeons;Trusted_Connection=True;MultipleActiveResultSets=true";

        private static database.GameContext? context;

        public static database.GameContext getSharedInstance()
        {
            if (context == null)
            {
                DbContextManager.context = makeContext();
            }
            return DbContextManager.context;
        }

        private static database.GameContext makeContext()
        {
            // In this example, "ApplicationDbContext" is my DbContext class
            var options = new DbContextOptionsBuilder<database.GameContext>()
                    .UseSqlServer(_connectionString)
                    .Options;

            // With the options generated above, we can then just construct a new DbContext class
            using (var ctx = new database.GameContext(options))
            {
                return ctx;
            }
        }
    }
}