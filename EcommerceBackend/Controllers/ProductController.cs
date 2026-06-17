using EcommerceBackend.Data;
using EcommerceBackend.DTOs;
using EcommerceBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcommerceBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] int? categoryId,
        [FromQuery] int? page,
        [FromQuery] int? pageSize)
    {
        var query = _context.Products
            .Include(x => x.Category)
            .Include(x => x.Images)
            .Include(x => x.Sizes)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(x =>
                x.Name.ToLower().Contains(searchLower) ||
                (x.Category != null && x.Category.Name.ToLower().Contains(searchLower)) ||
                x.Description.ToLower().Contains(searchLower) ||
                x.Brand.ToLower().Contains(searchLower)
            );
        }

        if (categoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == categoryId.Value);
        }

        if (page.HasValue && pageSize.HasValue)
        {
            var totalItems = await query.CountAsync();
            var products = await query
                .Skip((page.Value - 1) * pageSize.Value)
                .Take(pageSize.Value)
                .ToListAsync();

            return Ok(new
            {
                TotalItems = totalItems,
                Page = page.Value,
                PageSize = pageSize.Value,
                Products = products
            });
        }
        else
        {
            var products = await query.ToListAsync();
            return Ok(products);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _context.Products
            .Include(x => x.Category)
            .Include(x => x.Images)
            .Include(x => x.Sizes)
            .Include(x => x.Reviews)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create(ProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            Stock = dto.Stock,
            Brand = dto.Brand,
            IsFeatured = dto.IsFeatured,
            IsTrending = dto.IsTrending,
            CategoryId = dto.CategoryId
        };

        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        return Ok(product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound();

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.DiscountPrice = dto.DiscountPrice;
        product.Stock = dto.Stock;
        product.Brand = dto.Brand;
        product.IsFeatured = dto.IsFeatured;
        product.IsTrending = dto.IsTrending;
        product.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();

        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound();

        _context.Products.Remove(product);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Product Deleted" });
    }
}