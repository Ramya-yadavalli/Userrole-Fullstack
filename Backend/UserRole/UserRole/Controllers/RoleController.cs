using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserRole.Data;
using UserRole.Data.Interface;

namespace UserRole.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRole _role;
        public RoleController(IRole role)
        {
            _role = role;
        }
        [HttpGet]
        public IActionResult GetRoles()
        {
            return Ok(_role.GetRoles());
        }
        [HttpGet("{id}")]
        public IActionResult GetRole(int id)
        {
            return Ok(_role.GetRole(id));
        }
        [HttpPost]
        public IActionResult AddRole(Role role)
        {
            return Ok(_role.AddRole(role));
        }
        [HttpPut]
        public IActionResult UpdateRole(Role role)
        {
            return Ok(_role.UpdateRole(role));
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteRole(int id)
        {
            return Ok(_role.DeleteRole(id));
        }
    }
}
