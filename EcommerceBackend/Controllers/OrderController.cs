using EcommerceBackend.Data;
using EcommerceBackend.DTOs;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcommerceBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OrderController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("place")]
    public async Task<IActionResult> PlaceOrder(OrderDto dto)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == dto.UserId);

        if (cart == null || !cart.CartItems.Any())
            return BadRequest("Cart is empty");

        var order = new Order
        {
            UserId = dto.UserId,
            TotalAmount = dto.TotalAmount,
            Status = $"Placed;Address:{dto.Address};PaymentMethod:{dto.PaymentMethod};PaymentStatus:Paid",
            OrderDate = DateTime.UtcNow
        };

        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        foreach (var item in cart.CartItems)
        {
            _context.OrderItems.Add(new OrderItem
            {
                OrderId = order.Id,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = item.Product?.Price ?? 0
            });
        }

        _context.CartItems.RemoveRange(cart.CartItems);

        await _context.SaveChangesAsync();

        return Ok(order);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetOrders(int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .ThenInclude(p => p.Images)
            .Where(o => o.UserId == userId)
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetOrder(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
            return NotFound();

        return Ok(order);
    }

    [HttpPut("status/{orderId}")]
    public async Task<IActionResult> UpdateStatus(
        int orderId,
        string status)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
            return NotFound();

        var existingStatus = order.Status ?? string.Empty;
        var parts = existingStatus.Split(';');
        var addressPart = parts.FirstOrDefault(p => p.StartsWith("Address:"));
        var payMethodPart = parts.FirstOrDefault(p => p.StartsWith("PaymentMethod:"));
        var payStatusPart = parts.FirstOrDefault(p => p.StartsWith("PaymentStatus:"));
        
        var newStatusStr = status;
        if (addressPart != null) newStatusStr += ";" + addressPart;
        if (payMethodPart != null) newStatusStr += ";" + payMethodPart;
        if (payStatusPart != null) newStatusStr += ";" + payStatusPart;

        order.Status = newStatusStr;

        await _context.SaveChangesAsync();

        return Ok(order);
    }
}