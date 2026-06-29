using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
using GradHubDAL.Unite_Of_Work.Interface;
using Microsoft.AspNetCore.Http;

namespace GRadHubBLL.Services
{
    public class StudentService : IStudentService
    {
        private readonly IuniteOfWork _unitOfWork;

        public StudentService(IuniteOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<CandidateProfileDto> GetProfileAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<CandidateProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<string> UploadCvAsync(int userId, IFormFile file)
        {
            throw new NotImplementedException();
        }

        public Task AddSkillAsync(int userId, int skillId)
        {
            throw new NotImplementedException();
        }

        public Task RemoveSkillAsync(int userId, int skillId)
        {
            throw new NotImplementedException();
        }
    }
}
