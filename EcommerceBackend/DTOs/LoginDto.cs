namespace EcommerceBackend.DTOs;

public class LoginDto
{
    public string MobileNumber { get; set; } = string.Empty;

    public string Otp { get; set; } = string.Empty;
}