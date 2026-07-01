using GRadHubBLL.DTOs;

namespace GRadHubBLL.Interfaces
{
    public interface IMessagingService
    {
        Task<ConversationDto> StartConversationAsync(int recruiterId, StartConversationDto dto);
        Task<MessageDto> ReplyAsync(int userId, int conversationId, ReplyDto dto);
        Task<IEnumerable<ConversationSummaryDto>> ListConversationsAsync(int userId);
        Task<ConversationDetailDto> GetConversationAsync(int userId, int conversationId);
    }
}
