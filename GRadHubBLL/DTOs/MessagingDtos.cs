namespace GRadHubBLL.DTOs
{
    public record StartConversationDto(int StudentId, string Body, string? JobPositionTitle);

    public record ReplyDto(string Body);

    public record MessageDto(
        int Id,
        int ConversationId,
        int SenderUserId,
        string SenderName,
        string SenderRole,
        string Body,
        bool IsRead,
        DateTime SentAt);

    public record ConversationDto(
        int Id,
        int RecruiterId,
        int StudentId,
        string? JobPositionTitle,
        DateTime CreatedAt,
        MessageDto FirstMessage);

    public record ConversationSummaryDto(
        int Id,
        string? JobPositionTitle,
        DateTime LastMessageAt,
        int UnreadCount,
        // For student's view: recruiter info
        string? RecruiterCompanyName,
        string? RecruiterIndustry,
        // For recruiter's view: student info
        string? StudentFullName,
        string? StudentField);

    public record ConversationDetailDto(
        int Id,
        string? JobPositionTitle,
        string? RecruiterCompanyName,
        string? RecruiterIndustry,
        string? StudentFullName,
        string? StudentField,
        IEnumerable<MessageDto> Messages);
}
