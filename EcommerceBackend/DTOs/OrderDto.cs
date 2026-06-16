namespace EcommerceBackend.DTOs;

public class OrderDto
{
    public int UserId { get; set; }

    public decimal TotalAmount { get; set; }

    public string PaymentMethod { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;
}