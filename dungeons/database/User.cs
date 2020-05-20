using System.ComponentModel.DataAnnotations.Schema;

namespace dungeons.database
{
    public class User
    {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string ID { get; set; }

        public User(string ID)
        {
            this.ID = ID;
        }
    }
}