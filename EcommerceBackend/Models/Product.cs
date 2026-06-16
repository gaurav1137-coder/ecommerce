namespace EcommerceBackend.Models;

public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public decimal DiscountPrice { get; set; }

    public int Stock { get; set; }

    public string Brand { get; set; } = string.Empty;

    public bool IsFeatured { get; set; }

    public bool IsTrending { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int CategoryId { get; set; }

    public Category? Category { get; set; }

public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();

public ICollection<ProductSize> Sizes { get; set; } = new List<ProductSize>();

public ICollection<Review> Reviews { get; set; } = new List<Review>();

}