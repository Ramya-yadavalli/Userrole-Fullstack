using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserRole.Data;
using UserRole.Data.Interface;

namespace UserRole.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRoleController : ControllerBase
    {
        private readonly IUserRole _userRole;
        public UserRoleController(IUserRole userRole)
        {
            _userRole = userRole;
        }
        [HttpGet]
        public IActionResult GetUserRoles()
        {
            return Ok(_userRole.GetUserRoles());
        }
        [HttpGet("{id}")]
        public IActionResult GetUserRole(int id)
        {
            return Ok(_userRole.GetUserRole(id));
        }

        [HttpPost]
        public IActionResult AddUserRole(UserRoles userRole)
        {
            return Ok(_userRole.AddUserRole(userRole));
        }
        [HttpPut]
        public IActionResult UpdateUserRole(UserRoles userRole)
        {
            return Ok(_userRole.UpdateUserRole(userRole));
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteUserRole(int id)
        {
            return Ok(_userRole.DeleteUserRole(id));
        }
    }
}
