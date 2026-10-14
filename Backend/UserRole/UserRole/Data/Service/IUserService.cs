using UserRole.Data.Interface;

namespace UserRole.Data.Service
{
    public class IUserService : IUser
    {
        private readonly AppDbContext _context;
        public IUserService(AppDbContext context)
        {
            _context = context;
        }
        public bool AddUser(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
            return true;
        }

        public bool DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            _context.Users.Remove(user);
            _context.SaveChanges();
            return true;
        }

        public User GetUser(int id)
        {
            return _context.Users.Find(id);
        }

        public List<User> GetUsers()
        {
           return _context.Users.ToList();
        }

        public bool UpdateUser(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
            return true;
        }
    }
}
