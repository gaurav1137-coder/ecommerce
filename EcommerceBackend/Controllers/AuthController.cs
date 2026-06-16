using EcommerceBackend.Data;
using EcommerceBackend.DTOs;
using EcommerceBackend.Models;
using EcommerceBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcommerceBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    private readonly JwtService _jwtService;

    public AuthController(
        ApplicationDbContext context,
        JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterDto dto)
    {
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            MobileNumber = dto.MobileNumber,
            RoleId = 2
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(
                x => x.MobileNumber ==
                     dto.MobileNumber);

        if (user == null)
            return Unauthorized();

        if (dto.Otp != "0000")
            return Unauthorized("Invalid OTP");

        var token =
            _jwtService.GenerateToken(
                user.MobileNumber);

        return Ok(new
        {
            Token = token,
            User = user
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok("Logged Out");
    }
}