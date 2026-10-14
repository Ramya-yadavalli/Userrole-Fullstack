namespace UserRole.Data.Interface
{
    public interface IUserRole
    {
        List<UserRoles> GetUserRoles();
        UserRoles GetUserRole(int  id);
        bool AddUserRole(UserRoles userRole);
        bool DeleteUserRole(int id);
        bool UpdateUserRole(UserRoles userRole);
    }
}
