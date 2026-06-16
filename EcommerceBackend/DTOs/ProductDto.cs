namespace EcommerceBackend.DTOs;

public class ProductDto
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public decimal DiscountPrice { get; set; }

    public int Stock { get; set; }

    public string Brand { get; set; } = string.Empty;

    public bool IsFeatured { get; set; }

    public bool IsTrending { get; set; }

    public int CategoryId { get; set; }
}