using GRadHubBLL.DTOs;

namespace GRadHubBLL.Services.Interface
{
    public interface IRecruiterService
    {
        Task<CompanyProfileDto> GetProfileAsync(int userId);
    }
}
