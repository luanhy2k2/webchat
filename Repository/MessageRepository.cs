using Data;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

public class MessageRepository
{
    private readonly AppDbContext _context;

    public MessageRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Message> GetMessageById(int id)
    {
        return await _context.Message.FindAsync(id);
    }


    public IQueryable<Message> GetMessagesByRoomName(string roomName)
    {
        return _context.Message.Where(m => m.Room.Name == roomName)
            .Include(m => m.User)
            .Include(m => m.Room)
            .OrderByDescending(m => m.TimeStamp)
            .Take(20);
    }

    public async Task<Message> CreateMessage(Message message)
    {
        _context.Message.Add(message);
        await _context.SaveChangesAsync();
        return message;
    }

    public async Task DeleteMessage(Message message)
    {
        _context.Message.Remove(message);
        await _context.SaveChangesAsync();
    }
}
