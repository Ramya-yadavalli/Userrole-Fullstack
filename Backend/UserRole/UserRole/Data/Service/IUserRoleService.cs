using UserRole.Data.Interface;

namespace UserRole.Data.Service
{
    public class IUserRoleService : IUserRole
    {
		private readonly AppDbContext _context;
		public IUserRoleService(AppDbContext context)
		{
			_context = context;
		}

        public bool AddUserRole(UserRoles userRole)
        {
            _context.UserRoles.Add(userRole);
            _context.SaveChanges();
            return true;
        }

        public bool DeleteUserRole(int id)
        {
            var userRole = _context.UserRoles.Find(id);
            _context.UserRoles.Remove(userRole);
            _context.SaveChanges();
            return true;
        }

        public UserRoles GetUserRole(int id)
        {
            return _context.UserRoles.Find(id);
        }

        public List<UserRoles> GetUserRoles()
        {
            return _context.UserRoles.ToList();
        }

        public bool UpdateUserRole(UserRoles userRole)
        {
            _context.UserRoles.Update(userRole);
            _context.SaveChanges();
            return true;
        }
    }
}
