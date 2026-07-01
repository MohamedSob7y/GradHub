namespace GRadHubBLL.DTOs
{
    public record CompanyProfileDto(
        int Id,
        int UserId,
        string CompanyName,
        string Industry,
        string? Description,
        string? WebsiteLink,
        string? LinkedInLink,
        string? WhatsAppNumber,
        string? ContactEmail,
        string VerificationStatus,
        bool IsVerified,
        decimal AverageRating);

    public record UpdateCompanyDto(
        string CompanyName,
        string Industry,
        string? Description,
        string? WebsiteLink,
        string? LinkedInLink,
        string? WhatsAppNumber,
        string? ContactEmail);
}
