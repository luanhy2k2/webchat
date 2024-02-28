using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Entities
{
    [Table("UploadFile")]
    public class FileUpload
    {
        [Key]
        public int Id { get; set; }
        public string NameFile { get; set; }
        public string Content { get; set; }
        public Message Message { get; set; }
    }
}
