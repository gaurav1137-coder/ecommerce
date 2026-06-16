using EcommerceBackend.Data;
using EcommerceBackend.DTOs;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcommerceBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CartController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCart(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .ThenInclude(ci => ci.Product)
            .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return Ok(new List<CartItem>());

        return Ok(cart);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddToCart(CartDto dto)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == dto.UserId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = dto.UserId
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
        }

        var existingItem = cart.CartItems
            .FirstOrDefault(x => x.ProductId == dto.ProductId);

        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
        }
        else
        {
            cart.CartItems.Add(new CartItem
            {
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            });
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Added To Cart" });
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateQuantity(CartDto dto)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == dto.UserId);

        if (cart == null)
            return NotFound();

        var item = cart.CartItems
            .FirstOrDefault(x => x.ProductId == dto.ProductId);

        if (item == null)
            return NotFound();

        item.Quantity = dto.Quantity;

        await _context.SaveChangesAsync();

        return Ok(item);
    }

    [HttpDelete("{cartItemId}")]
    public async Task<IActionResult> RemoveItem(int cartItemId)
    {
        var item = await _context.CartItems.FindAsync(cartItemId);

        if (item == null)
            return NotFound();

        _context.CartItems.Remove(item);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Removed" });
    }

    [HttpDelete("clear/{userId}")]
    public async Task<IActionResult> ClearCart(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.CartItems)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            return NotFound();

        _context.CartItems.RemoveRange(cart.CartItems);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Cart Cleared" });
    }
}