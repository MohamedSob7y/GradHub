namespace GRadHubBLL.DTOs
{
    public record RateDto(int ToUserId, int Value, string? Comment);

    public record RatingResultDto(int Id, int FromUserId, int ToUserId, int Value, string? Comment, DateTime CreatedAt);
}
