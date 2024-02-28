using Application.Hubs;
using Application.Model;
using AutoMapper;
using Data;
using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Repository;
using System.Text.RegularExpressions;

namespace ChatApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadFileController : ControllerBase
    {
        private readonly UploadRepository _uploadRepository;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IMapper _mapper;
 
        private readonly IWebHostEnvironment _environment;
        private readonly AppDbContext _context;
        public UploadFileController(UploadRepository uploadRepository, AppDbContext context, Microsoft.AspNetCore.Hosting.IWebHostEnvironment webHostEnvironment,
            IMapper mapper, IHubContext<ChatHub> hubContext, IWebHostEnvironment environment)
        {
            _uploadRepository = uploadRepository;
            _context = context;
          
            _hubContext = hubContext;
            _mapper = mapper;
            _environment = environment;
        }
        



        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Upload([FromForm] UploadModel file)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var username = User.Identity.Name; // Assuming you have authentication setup properly
                    await _uploadRepository.UploadMessage(file, username);
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            return BadRequest("Invalid model state");
        }
       
    }
}
