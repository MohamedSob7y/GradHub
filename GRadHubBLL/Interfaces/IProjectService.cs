using GRadHubBLL.DTOs;
using Microsoft.AspNetCore.Http;

namespace GRadHubBLL.Interfaces
{
    public interface IProjectService
    {
        Task<ProjectDto> CreateAsync(int userId, CreateProjectDto dto);
        Task<ProjectDto> UpdateAsync(int userId, int projectId, UpdateProjectDto dto);
        Task DeleteAsync(int userId, int projectId);
        Task<IEnumerable<ProjectDto>> GetMyProjectsAsync(int userId);
        Task<ProjectDto> GetByIdAsync(int userId, int projectId);
        Task AddSkillAsync(int userId, int projectId, int skillId);
        Task RemoveSkillAsync(int userId, int projectId, int skillId);
        Task<string> UploadThumbnailAsync(int userId, int projectId, IFormFile file);
        Task<PagedResult<ProjectSummaryDto>> BrowseAsync(BrowseProjectsQuery query);
        Task<ProjectDetailDto> GetDetailForRecruiterAsync(int projectId);
    }
}
