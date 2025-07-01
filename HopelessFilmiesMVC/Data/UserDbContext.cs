using Microsoft.EntityFrameworkCore;
using HopelessFilmiesMVC.Models;

namespace HopelessFilmiesMVC.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<ContactForm> ContactForms { get; set; } // Maps to Contact_Form table

    }
}
