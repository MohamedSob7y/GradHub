using GRadHubBLL.DTOs;

namespace GRadHubBLL.Interfaces
{
    public interface IRecruiterService
    {
        Task<CompanyProfileDto> GetProfileAsync(int userId);
        Task<CompanyProfileDto> UpdateProfileAsync(int userId, UpdateCompanyDto dto);
    }
}
