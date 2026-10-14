namespace UserRole.Data.Interface
{
    public interface IRole
    {
        List<Role> GetRoles();
        Role GetRole(int id);
        bool AddRole(Role role) ;
        bool DeleteRole(int id);
        bool UpdateRole(Role role) ;
    }
}
