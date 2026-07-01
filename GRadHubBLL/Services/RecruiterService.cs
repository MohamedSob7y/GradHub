using GRadHubBLL.DTOs;
using GRadHubBLL.Exceptions;
using GRadHubBLL.Interfaces;
using GradHubDAL.Models;
using GradHubDAL.Unite_Of_Work.Interface;

namespace GRadHubBLL.Services
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

        public async Task<CompanyProfileDto> UpdateProfileAsync(int userId, UpdateCompanyDto dto)
        {
            // Validate
            var errors = new Dictionary<string, string[]>();

            if (string.IsNullOrWhiteSpace(dto.CompanyName))
                errors["CompanyName"] = new[] { "Company name is required." };
            else if (dto.CompanyName.Length > 150)
                errors["CompanyName"] = new[] { "Company name must be 150 characters or fewer." };

            if (string.IsNullOrWhiteSpace(dto.Industry))
                errors["Industry"] = new[] { "Industry is required." };

            if (errors.Count > 0)
                throw new ValidationException(errors);

            // Load profile
            var repo = _unitOfWork.GetRepository<CompanyProfile>();
            var profile = repo.GetAll(p => p.UserId == userId).FirstOrDefault();

            if (profile is null)
                throw new NotFoundException($"Company profile for user {userId} was not found.");

            // Apply updates
            profile.CompanyName    = dto.CompanyName;
            profile.Industry       = dto.Industry;
            profile.Description    = dto.Description;
            profile.WebsiteLink    = dto.WebsiteLink;
            profile.LinkedInLink   = dto.LinkedInLink;
            profile.WhatsAppNumber = dto.WhatsAppNumber;
            profile.ContactEmail   = dto.ContactEmail;

            repo.Update(profile);
            _unitOfWork.SaveChanges();

            var result = new CompanyProfileDto
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

            return await Task.FromResult(result);
        }
    }
}
