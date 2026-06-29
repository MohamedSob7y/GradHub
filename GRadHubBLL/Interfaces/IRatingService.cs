using GRadHubBLL.DTOs;

namespace GRadHubBLL.Interfaces
{
    public interface IRatingService
    {
        Task<RatingResultDto> RateAsync(int fromUserId, RateDto dto);
        Task DeleteRatingAsync(int fromUserId, int toUserId);
    }
}
