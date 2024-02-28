using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Model
{
    public class SignUpModel
    {
       
        public string Email { get; set; } = null!;
        
        public string Password { get; set; } = null!;
       
        public string FullName { get; set; }
        
        public IFormFile? Avartar { get; set; }

    }
}
