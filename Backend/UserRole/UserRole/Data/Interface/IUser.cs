namespace UserRole.Data.Interface
{
    public interface IUser
    {
        List<User> GetUsers();
        User GetUser(int id);
        bool AddUser(User user);
        bool DeleteUser(int id);
        bool UpdateUser(User user);
    }
}
