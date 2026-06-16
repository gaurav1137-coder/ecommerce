namespace EcommerceBackend.Models;

public class ProductSize
{
    public int Id { get; set; }

    public string Size { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public int ProductId { get; set; }

    public Product? Product { get; set; }
}