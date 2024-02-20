using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Entities
{
    [Table("Message")]
    public class Message
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }

        [Column("Content")]
        [MaxLength(2000)]
        public string Content { get; set; }

        [Column("Timestamp")]
        public DateTime TimeStamp { get; set; }

        //[Column("RoomId")]
        //[ForeignKey("Room")]
        //public int RoomId { get; set; }

        //[Column("UserId")]
        //[ForeignKey("User")]
        //public string UserId { get; set; }

        public ManageUser User { get; set; }
        public Room Room { get; set; }
    }
}
