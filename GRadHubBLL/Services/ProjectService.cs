using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
using GradHubDAL.Unite_Of_Work.Interface;
using Microsoft.AspNetCore.Http;

namespace GRadHubBLL.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IuniteOfWork _unitOfWork;

        public ProjectService(IuniteOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<ProjectDto> CreateAsync(int userId, CreateProjectDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<ProjectDto> UpdateAsync(int userId, int projectId, UpdateProjectDto dto)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int userId, int projectId)
        {
            throw new NotImplementedException();
        }

        public Task<ProjectDto> GetByIdAsync(int userId, int projectId)
        {
            throw new NotImplementedException();
        }

        public Task AddSkillAsync(int userId, int projectId, int skillId)
        {
            throw new NotImplementedException();
        }

        public Task RemoveSkillAsync(int userId, int projectId, int skillId)
        {
            throw new NotImplementedException();
        }

        public Task<string> UploadThumbnailAsync(int userId, int projectId, IFormFile file)
        {
            throw new NotImplementedException();
        }

        public Task<PagedResult<ProjectSummaryDto>> BrowseAsync(BrowseProjectsQuery query)
        {
            throw new NotImplementedException();
        }

        public Task<ProjectDetailDto> GetDetailForRecruiterAsync(int projectId)
        {
            throw new NotImplementedException();
        }
    }
}
