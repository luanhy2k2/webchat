using Application.Hubs;
using Application.Model;
using AutoMapper;
using Data;
using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class MessagesController : ControllerBase
{
    private readonly MessageRepository _messageRepository;
    private readonly IMapper _mapper;
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly AppDbContext _context;
    public MessagesController(MessageRepository messageRepository, AppDbContext context, IMapper mapper, IHubContext<ChatHub> hubContext)
    {
        _messageRepository = messageRepository;
        _context = context;
        _mapper = mapper;
        _hubContext = hubContext;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MessageModel>> Get(int id)
    {
        var message = await _messageRepository.GetMessageById(id);
        if (message == null)
            return NotFound();

        var messageViewModel = _mapper.Map<Message, MessageModel>(message);
        return Ok(messageViewModel);
    }

    [HttpGet("Room/{roomName}")]
    public IActionResult GetMessages(string roomName)
    {
        var messages = _messageRepository.GetMessagesByRoomName(roomName).AsEnumerable().Reverse().ToList();
        var messagesViewModel = _mapper.Map<IEnumerable<Message>, IEnumerable<MessageModel>>(messages);
        return Ok(messagesViewModel);
    }

    [HttpPost]
    public async Task<ActionResult<Message>> Create([FromBody] CreateMessage messageViewModel)
    {
        var user = _context.Users.FirstOrDefault(u => u.UserName == User.Identity.Name);
        var room = _context.Room.FirstOrDefault(r => r.Name == messageViewModel.RoomName);
        if (room == null)
            return BadRequest();
        
        var msg = new Message()
        {
            Content = Regex.Replace(messageViewModel.Content, @"<.*?>", string.Empty),
            User = user,
            Room = room,
            TimeStamp = DateTime.Now
        };

        var createdMessage = await _messageRepository.CreateMessage(msg);

        // Broadcast the message
        var createdMessageViewModel = _mapper.Map<Message, MessageModel>(createdMessage);
        await _hubContext.Clients.Group(room.Name).SendAsync("newMessage", createdMessageViewModel);

        return CreatedAtAction(nameof(Get), new { id = createdMessage.Id }, createdMessageViewModel);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var message = await _messageRepository.GetMessageById(id);
        if (message == null || message.User.UserName != User.Identity.Name)
            return NotFound();

        await _messageRepository.DeleteMessage(message);
        return NoContent();
    }
}
