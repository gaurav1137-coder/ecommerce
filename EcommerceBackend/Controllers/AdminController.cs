using EcommerceBackend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcommerceBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var totalUsers = await _context.Users.CountAsync();

        var totalProducts = await _context.Products.CountAsync();

        var totalOrders = await _context.Orders.CountAsync();

        var totalCategories = await _context.Categories.CountAsync();

        return Ok(new
        {
            TotalUsers = totalUsers,
            TotalProducts = totalProducts,
            TotalOrders = totalOrders,
            TotalCategories = totalCategories
        });
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(x => x.User)
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("customers")]
    public async Task<IActionResult> GetCustomers()
    {
        var customers = await _context.Users
            .Where(x => x.RoleId == 2)
            .ToListAsync();

        return Ok(customers);
    }
}