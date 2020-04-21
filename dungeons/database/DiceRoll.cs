using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace dungeons.database
{
    public class DiceRoll
    {
        
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public int diceType { get; set; }
        public DateTime date { get; set; }
        public Campaign campaign { get; set; }
    }
}