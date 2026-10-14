using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UserRole.Data;
using UserRole.Data.Interface;

namespace UserRole.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
		private readonly IUser _user;
        public UserController(IUser user)
        {
            _user = user;
        }
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(_user.GetUsers());
        }
		[HttpGet("{id}")]
		public IActionResult GetUser(int id)
		{
			return Ok(_user.GetUser(id));
		}
		[HttpPost]
		public IActionResult AddUser(User user)
		{
			return Ok(_user.AddUser(user));
		}
		[HttpPut]
		public IActionResult UpdateUser(User user)
		{
			return Ok(_user.UpdateUser(user));
		}
		[HttpDelete("{id}")]
		public IActionResult DeleteUser(int id)
		{
			return Ok(_user.DeleteUser(id));
		}
	}
}
