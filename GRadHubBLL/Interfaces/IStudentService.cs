using GRadHubBLL.DTOs;
using Microsoft.AspNetCore.Http;

namespace GRadHubBLL.Interfaces
{
    public interface IStudentService
    {
        Task<CandidateProfileDto> GetProfileAsync(int userId);
        Task<CandidateProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto dto);
        Task<string> UploadCvAsync(int userId, IFormFile file);
        Task AddSkillAsync(int userId, int skillId);
        Task RemoveSkillAsync(int userId, int skillId);
    }
}
