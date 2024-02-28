using Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Data
{
    public class AppDbContext:IdentityDbContext<ManageUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        }
       
        public DbSet<Room> Room { get;set; }
        public DbSet<Message> Message { get; set; }
        public DbSet<FileUpload> FileUpload { get; set; }
    }
}
