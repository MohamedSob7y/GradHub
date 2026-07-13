namespace GRadHubBLL.DTOs
{
    public record CreateProjectDto(
        string Title,
        string Description,
        string Category,
        IEnumerable<int> SkillIds,
        string? GitHubLink,
        string? LiveDemoLink);

    public record UpdateProjectDto(
        string? Title,
        string? Description,
        string? Category,
        string? Status,
        string? GitHubLink,
        string? LiveDemoLink,
        IEnumerable<int>? SkillIds = null);

    public record ProjectDto(
        int Id,
        int CandidateProfileId,
        string Title,
        string Description,
        string Category,
        string Status,
        string? GitHubLink,
        string? LiveDemoLink,
        string? ThumbnailPath,
        IEnumerable<SkillDto> Skills,
        DateTime CreatedAt,
        DateTime? UpdatedAt);

    public record ProjectSummaryDto(
        int Id,
        string Title,
        string Category,
        string Status,
        string? ThumbnailPath,
        IEnumerable<SkillDto> Skills,
        string StudentFullName,
        string StudentField);

    public record ProjectDetailDto(
        int Id,
        string Title,
        string Description,
        string Category,
        string Status,
        string? GitHubLink,
        string? LiveDemoLink,
        string? ThumbnailPath,
        IEnumerable<SkillDto> Skills,
        string StudentFullName,
        string StudentField,
        string? StudentContactEmail,
        string? StudentWhatsApp,
        string? StudentLinkedIn);

    public record BrowseProjectsQuery(
        int Page = 1,
        int PageSize = 10,
        string? Category = null,
        IEnumerable<int>? SkillIds = null,
        string? Search = null);

    public record PagedResult<T>(IEnumerable<T> Items, int TotalCount, int Page, int PageSize, int TotalPages);
}
