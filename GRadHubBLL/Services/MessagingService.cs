using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
using GradHubDAL.Unite_Of_Work.Interface;

namespace GRadHubBLL.Services
{
    public class MessagingService : IMessagingService
    {
        private readonly IuniteOfWork _unitOfWork;

        public MessagingService(IuniteOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<ConversationDto> StartConversationAsync(int recruiterId, StartConversationDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<MessageDto> ReplyAsync(int userId, int conversationId, ReplyDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ConversationSummaryDto>> ListConversationsAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<ConversationDetailDto> GetConversationAsync(int userId, int conversationId)
        {
            throw new NotImplementedException();
        }
    }
}
