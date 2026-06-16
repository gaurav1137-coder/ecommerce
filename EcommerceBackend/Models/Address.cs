namespace EcommerceBackend.Models;

public class Address
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User? User { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string MobileNumber { get; set; } = string.Empty;

    public string AddressLine { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public string Pincode { get; set; } = string.Empty;
}