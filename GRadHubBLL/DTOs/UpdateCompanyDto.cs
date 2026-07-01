namespace GRadHubBLL.DTOs
{
    public class UpdateCompanyDto
    {
        public string CompanyName { get; set; } = null!;
        public string Industry { get; set; } = null!;
        public string? Description { get; set; }
        public string? WebsiteLink { get; set; }
        public string? LinkedInLink { get; set; }
        public string? WhatsAppNumber { get; set; }
        public string? ContactEmail { get; set; }
    }
}
