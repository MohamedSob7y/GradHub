using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
using GradHubDAL.Unite_Of_Work.Interface;

namespace GRadHubBLL.Services
{
    public class RatingService : IRatingService
    {
        private readonly IuniteOfWork _unitOfWork;

        public RatingService(IuniteOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<RatingResultDto> RateAsync(int fromUserId, RateDto dto)
        {
            throw new NotImplementedException();
        }

        public Task DeleteRatingAsync(int fromUserId, int toUserId)
        {
            throw new NotImplementedException();
        }
    }
}
