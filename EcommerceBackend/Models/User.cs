namespace EcommerceBackend.Models;

public class User
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string MobileNumber { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int RoleId { get; set; }

    public Role? Role { get; set; }
    public ICollection<Address> Addresses { get; set; } = new List<Address>();

public ICollection<Order> Orders { get; set; } = new List<Order>();

public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}