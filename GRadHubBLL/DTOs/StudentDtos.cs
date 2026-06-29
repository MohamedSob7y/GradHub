namespace GRadHubBLL.DTOs
{
    public record SkillDto(int Id, string Name);

    public record CandidateProfileDto(
        int Id,
        int UserId,
        string FullName,
        string Field,
        string? Bio,
        int ExperienceYears,
        string? GraduationProjectLink,
        string? PortfolioLink,
        string? LinkedInLink,
        string? WhatsAppNumber,
        string? ContactEmail,
        IEnumerable<SkillDto> Skills);

    public record UpdateProfileDto(
        string? Field,
        string? Bio,
        int? ExperienceYears,
        string? GraduationProjectLink,
        string? PortfolioLink,
        string? LinkedInLink,
        string? WhatsAppNumber,
        string? ContactEmail);
}
