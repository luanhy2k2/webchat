using Application.Hubs;
using Application.Model;
using AutoMapper;
using Data;
using Data.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Repository
{
    public class UploadRepository
    {
        
        private readonly AppDbContext _context;
        private readonly int FileSizeLimit;
        private readonly string[] AllowedExtensions;
        private readonly IWebHostEnvironment _environment;
       
        private readonly IMapper _mapper;
        private readonly IHubContext<ChatHub> _hubContext;
        public UploadRepository(IConfiguration configuration, Microsoft.AspNetCore.Hosting.IWebHostEnvironment webHostEnvironment,
            AppDbContext context, IMapper mapper, IHubContext<ChatHub> hubContext )
        {
           
            _context = context;
            _environment = webHostEnvironment;
          
            _hubContext = hubContext;
            _mapper = mapper;
            FileSizeLimit = configuration.GetSection("FileUpload").GetValue<int>("FileSizeLimit");
            AllowedExtensions = configuration.GetSection("FileUpload").GetValue<string>("AllowedExtensions").Split(",");
        }
        private bool Validate(IFormFile file)
        {
            if (file.Length > FileSizeLimit)
                return false;

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !AllowedExtensions.Any(s => s.Contains(extension)))
                return false;

            return true;
        }
        
        public async Task<MessageModel> UploadMessage(UploadModel uploadViewModel, string username)
        {
            if (!Validate(uploadViewModel.File))
            {
                throw new Exception("Validation failed!");
            }

       
            var folderPath = Path.Combine(_environment.WebRootPath, "uploads");
            var filePath = Path.Combine(folderPath, uploadViewModel.File.FileName);
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await uploadViewModel.File.CopyToAsync(fileStream);
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            var room = await _context.Room.FirstOrDefaultAsync(r => r.Id == uploadViewModel.RoomId);
            if (user == null || room == null)
                throw new Exception("User or room not found!");
            string htmlImage = string.Format(
                    "<a href=\"https://localhost:7066/uploads/{0}\" target=\"_blank\">" +
                    "<img src=\"https://localhost:7066/uploads/{0}\" class=\"post-image\">" +
                    "</a>", uploadViewModel.File.FileName);

            var message = new Message()
            {
                Content = Regex.Replace(htmlImage, @"(?i)<(?!img|a|/a|/img).*?>", string.Empty),
                TimeStamp = DateTime.Now,
                User = user,
                Room = room
            };
          

            await _context.Message.AddAsync(message);
            await _context.SaveChangesAsync();

            // Send image-message to group
            var messageViewModel = _mapper.Map<Message, MessageModel>(message);
            await _hubContext.Clients.Group(room.Name).SendAsync("newMessage", messageViewModel);

            return messageViewModel;
        }





    }
}
