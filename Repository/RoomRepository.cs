using Application.Hubs;
using Application.Model;
using AutoMapper;
using Data;
using Data.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class RoomRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly IHubContext<ChatHub> _hubContext;
        public RoomRepository(AppDbContext context, IMapper mapper, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _mapper = mapper;
            _hubContext = hubContext;
        }
        public async Task<IEnumerable<RoomModel>> Get()
        {

            var rooms = await _context.Room.ToListAsync();
            var roomsViewModel = _mapper.Map<IEnumerable<Room>, IEnumerable<RoomModel>>(rooms);

            return roomsViewModel;
        }
        public async Task<RoomModel> Get(int id)
        {
            var room = await _context.Room.FindAsync(id);
            if (room == null)
                throw new ArgumentNullException();

            var roomViewModel = _mapper.Map<Room, RoomModel>(room);
            return roomViewModel;
        }
        public async Task<Room> Create(string roomName, string adminUserName)
        {
            if (_context.Room.Any(r => r.Name == roomName))
                throw new Exception("Invalid room name or room already exists");

            var user = _context.Users.FirstOrDefault(u => u.UserName == adminUserName);
            var room = new Room()
            {
                Name = roomName,
                User = user
            };

            _context.Room.Add(room);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("addChatRoom", new { id = room.Id, name = room.Name });

            return room;
        }
        public async Task<Room> Edit(int id, string adminUsername, RoomModel roomViewModel)
        {
            if (_context.Room.Any(r => r.Name == roomViewModel.Name))
                throw new Exception("Invalid room name or room already exists");

            var room = await _context.Room
                .Include(r => r.User)
                .Where(r => r.Id == id && r.User.UserName == adminUsername)
                .FirstOrDefaultAsync();

            if (room == null)
                throw new Exception();

            room.Name = roomViewModel.Name;
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("updateChatRoom", new { id = room.Id, room.Name });

            return room;
        }

     
        public async Task<Room> Delete(int id, string adminUserName)
        {
            var room = await _context.Room
                .Include(r => r.User)
                .Where(r => r.Id == id && r.User.UserName == adminUserName)
                .FirstOrDefaultAsync();

            if (room == null)
                throw new Exception();

            _context.Room.Remove(room);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("removeChatRoom", room.Id);
            await _hubContext.Clients.Group(room.Name).SendAsync("onRoomDeleted", string.Format("Room {0} has been deleted.\nYou are moved to the first available room!", room.Name));

            return room;
        }
    }
}
