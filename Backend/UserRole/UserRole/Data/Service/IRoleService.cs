using UserRole.Data.Interface;

namespace UserRole.Data.Service
{
    public class IRoleService : IRole
    {
        private readonly AppDbContext _context;
        public IRoleService(AppDbContext context)
        {
            _context = context;
        }
        public bool AddRole(Role role)
        {
            _context.Roles.Add(role);
            _context.SaveChanges();
            return true;
        }

        public bool DeleteRole(int id)
        {
            var role = _context.Roles.Find(id);
            _context.Roles.Remove(role);
            _context.SaveChanges();
            return true;
        }

        public Role GetRole(int id)
        {
            return _context.Roles.Find(id);
        }

        public List<Role> GetRoles()
        {
            return _context.Roles.ToList();
        }

        public bool UpdateRole(Role role)
        {
            _context.Roles.Update(role);
            _context.SaveChanges();
            return true;
        }
    }
}
