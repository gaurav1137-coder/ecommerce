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

        var totalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);

        var recentOrders = await _context.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.OrderDate)
            .Take(5)
            .Select(o => new
            {
                o.Id,
                CustomerName = o.User != null ? o.User.Name : "Unknown",
                o.TotalAmount,
                o.Status,
                o.OrderDate
            })
            .ToListAsync();

        return Ok(new
        {
            TotalUsers = totalUsers,
            TotalProducts = totalProducts,
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue,
            RecentOrders = recentOrders
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