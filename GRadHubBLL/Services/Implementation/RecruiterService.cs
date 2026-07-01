using GRadHubBLL.DTOs;
using GRadHubBLL.Exceptions;
using GRadHubBLL.Services.Interface;
using GradHubDAL.Models;
using GradHubDAL.Unite_Of_Work.Interface;

namespace GRadHubBLL.Services.Implementation
{
    public class RecruiterService : IRecruiterService
    {
        private readonly IuniteOfWork _unitOfWork;

        public RecruiterService(IuniteOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<CompanyProfileDto> GetProfileAsync(int userId)
        {
            var repo = _unitOfWork.GetRepository<CompanyProfile>();
            var profile = repo.GetAll(p => p.UserId == userId).FirstOrDefault();

            if (profile is null)
                throw new NotFoundException($"Company profile for user {userId} was not found.");

            var dto = new CompanyProfileDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                CompanyName = profile.CompanyName,
                Industry = profile.Industry,
                Description = profile.Description,
                WebsiteLink = profile.WebsiteLink,
                LinkedInLink = profile.LinkedInLink,
                WhatsAppNumber = profile.WhatsAppNumber,
                ContactEmail = profile.ContactEmail,
                CreatedAt = profile.CreatedAt
            };

            return Task.FromResult(dto);
        }
    }
}
