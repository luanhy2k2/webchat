using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Model
{
    public class UploadModel
    {
        [Required]
        public int RoomId { get; set; }
        [Required]
        public IFormFile File { get; set; }

    }
    public class FileUploadModel
    {
        public IFormFile File { get; set; }
    }

}
