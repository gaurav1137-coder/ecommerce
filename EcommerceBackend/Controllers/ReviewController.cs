using EcommerceBackend.Data;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcommerceBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReviewController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddReview(Review review)
    {
        _context.Reviews.Add(review);

        await _context.SaveChangesAsync();

        return Ok(review);
    }

    [HttpGet("{productId}")]
    public async Task<IActionResult> GetReviews(int productId)
    {
        var reviews = await _context.Reviews
            .Where(x => x.ProductId == productId)
            .ToListAsync();

        return Ok(reviews);
    }
}