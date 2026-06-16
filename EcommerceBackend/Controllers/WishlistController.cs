using EcommerceBackend.Data;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcommerceBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WishlistController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public WishlistController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Add(Wishlist wishlist)
    {
        _context.Wishlists.Add(wishlist);

        await _context.SaveChangesAsync();

        return Ok(wishlist);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> Get(int userId)
    {
        var data = await _context.Wishlists
            .Include(x => x.Product)
            .ThenInclude(p => p.Images)
            .Where(x => x.UserId == userId)
            .ToListAsync();

        return Ok(data);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var item = await _context.Wishlists.FindAsync(id);

        if (item == null)
            return NotFound();

        _context.Wishlists.Remove(item);

        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Removed from wishlist" });
    }
}