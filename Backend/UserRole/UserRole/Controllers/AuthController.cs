using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserRole.Data;
using UserRole.DTOs;

namespace UserRole.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public AuthController(IConfiguration config, AppDbContext context)
        {
            _config = config;
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDTO loginDTO)
        {
            var user = _context.Users.FirstOrDefault(x => x.Email == loginDTO.Email && x.password == loginDTO.Password);

            var role = " ";
            if(user != null)
            {
                var userRoles = _context.UserRoles.FirstOrDefault(x=>x.UserId == user.Id);

                var roles = _context.Roles.Find(userRoles.RoleId);

                role = roles.Name;
            }

            if (user == null)
            {
                return Ok("User is not valid");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("YourSuperSecretKey123!sdjflkdsflkjsdlfjlsdfjlsdjflklksdjflk");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                }),

                Expires = DateTime.UtcNow.AddHours(2),

                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new { Token = tokenHandler.WriteToken(token) , Email = user.Email, Role = role });
        }
    }
}
