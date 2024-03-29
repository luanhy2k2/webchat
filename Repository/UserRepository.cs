﻿using Application.Model;
using Data.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Repository
{
    public class UserRepository
    {
        private readonly UserManager<ManageUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IWebHostEnvironment _environment;
        public UserRepository(UserManager<ManageUser> userManager, Microsoft.AspNetCore.Hosting.IWebHostEnvironment webHostEnvironment,
            IConfiguration configuration, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _configuration = configuration;
            _roleManager = roleManager;
            _environment = webHostEnvironment;
        }
        public async Task<Object> Login(LoginModel model)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if(user == null)
                {
                    return "Tài khoản không tồn tại";
                }
                var passWordValid = await _userManager.CheckPasswordAsync(user, model.Password);
                if(passWordValid == false) {
                    return "Mật khẩu không đúng";
                }
                var userRole = await _userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Email, model.Email),
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };
                foreach(var role in userRole)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role.ToString()));
                }
                var authenKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
                var tokenDes = new JwtSecurityToken(
                    expires: DateTime.Now.AddDays(1),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authenKey, SecurityAlgorithms.HmacSha512Signature));
                var writeToken = new JwtSecurityTokenHandler().WriteToken(tokenDes);
                return new { token = writeToken, fullName = user.FullName };
            }
            catch(Exception ex)
            {
                throw new Exception("Error", ex);
            }
        }
        public async Task<IdentityResult> SignUp(SignUpModel model)
        {
            try
            {
                var folderPath = Path.Combine(_environment.WebRootPath, "avatars");
                string fileName;

                if (model.Avartar != null)
                {
                    fileName = model.Avartar.FileName;

                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    var filePath = Path.Combine(folderPath, fileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.Avartar.CopyToAsync(fileStream);
                    }
                }
                else
                {
                    // If no avatar is uploaded, use the default avatar
                    fileName = "default-avatar.png";
                }

                var user = new ManageUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    FullName = model.FullName,
                    Avartar = "https://localhost:7066/avatars/" + fileName
                };

                var result = await _userManager.CreateAsync(user, model.Password);
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("Error", ex);
            }
        }

    }
}
