using Application.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository;

namespace ChatApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _reposiory;
        public UserController(UserRepository reposiory)
        {
            _reposiory = reposiory;
        }
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                var result = await _reposiory.Login(model);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
            
        }
        

        
        [HttpPost("signUp")]
        public async Task<ActionResult> SignUp(SignUpModel model)
        {
            try
            {
                var result = await _reposiory.SignUp(model);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
            
        }
    }
}
