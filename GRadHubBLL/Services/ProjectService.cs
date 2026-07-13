using GRadHubBLL.DTOs;
using GRadHubBLL.Exceptions;
using GRadHubBLL.Interfaces;
using GradHubDAL.Models;
using GradHubDAL.Unite_Of_Work.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace GRadHubBLL.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IuniteOfWork _unitOfWork;

        public ProjectService(IuniteOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ProjectDto> CreateAsync(int userId, CreateProjectDto dto)
        {
            // ── Validate inputs ───────────────────────────────────────────────
            var errors = new Dictionary<string, string[]>();

            if (string.IsNullOrWhiteSpace(dto.Title) || dto.Title.Length < 1 || dto.Title.Length > 200)
                errors[nameof(dto.Title)] = ["Title is required and must be between 1 and 200 characters."];

            if (string.IsNullOrWhiteSpace(dto.Description) || dto.Description.Length < 1 || dto.Description.Length > 2000)
                errors[nameof(dto.Description)] = ["Description is required and must be between 1 and 2000 characters."];

            if (string.IsNullOrWhiteSpace(dto.Category))
                errors[nameof(dto.Category)] = ["Category is required."];

            if (errors.Count > 0)
                throw new ValidationException(errors);

            // ── Load CandidateProfile by userId ───────────────────────────────
            var profile = await _unitOfWork
                .GetRepository<CandidateProfile>()
                .GetAll(p => p.UserId == userId)
                .FirstOrDefaultAsync();

            if (profile is null)
                throw new NotFoundException($"Candidate profile for user {userId} was not found.");

            // ── Create the GraduationProject entity ───────────────────────────
            var project = new GraduationProject
            {
                CandidateProfileId = profile.Id,
                Title              = dto.Title,
                Description        = dto.Description,
                Category           = dto.Category,
                Status             = "Draft",
                GitHubLink         = dto.GitHubLink,
                LiveDemoLink       = dto.LiveDemoLink,
                CreatedAt          = DateTime.UtcNow
            };

            _unitOfWork.GetRepository<GraduationProject>().Add(project);
            _unitOfWork.SaveChanges();

            // ── Create ProjectSkill links ─────────────────────────────────────
            if (dto.SkillIds is not null)
            {
                foreach (var skillId in dto.SkillIds)
                {
                    var projectSkill = new ProjectSkill
                    {
                        GraduationProjectId = project.Id,
                        SkillId             = skillId
                    };
                    _unitOfWork.GetRepository<ProjectSkill>().Add(projectSkill);
                }
                _unitOfWork.SaveChanges();
            }

            // ── Re-query project with skills to build the return DTO ──────────
            var savedProject = await _unitOfWork
                .GetRepository<GraduationProject>()
                .GetAll(
                    p => p.Id == project.Id,
                    p => p.ProjectSkills)
                .Include(p => p.ProjectSkills)
                    .ThenInclude(ps => ps.Skill)
                .FirstOrDefaultAsync();

            var skills = savedProject!.ProjectSkills
                .Select(ps => new SkillDto(ps.Skill.Id, ps.Skill.Name));

            return new ProjectDto(
                savedProject.Id,
                savedProject.CandidateProfileId,
                savedProject.Title,
                savedProject.Description,
                savedProject.Category,
                savedProject.Status,
                savedProject.GitHubLink,
                savedProject.LiveDemoLink,
                null,           // ThumbnailPath — not in MVP
                skills,
                savedProject.CreatedAt,
                savedProject.UpdatedAt);
        }

        public async Task<IEnumerable<ProjectDto>> GetMyProjectsAsync(int userId)
        {
            // ── Load CandidateProfile by userId ───────────────────────────────
            var profile = await _unitOfWork
                .GetRepository<CandidateProfile>()
                .GetAll(p => p.UserId == userId)
                .FirstOrDefaultAsync();

            if (profile is null)
                throw new NotFoundException($"Candidate profile for user {userId} was not found.");

            // ── Load all projects for this profile, including skills ───────────
            var projects = await _unitOfWork
                .GetRepository<GraduationProject>()
                .GetAll(
                    p => p.CandidateProfileId == profile.Id,
                    p => p.ProjectSkills)
                .Include(p => p.ProjectSkills)
                    .ThenInclude(ps => ps.Skill)
                .ToListAsync();

            // ── Map to DTOs ───────────────────────────────────────────────────
            return projects.Select(p => new ProjectDto(
                p.Id,
                p.CandidateProfileId,
                p.Title,
                p.Description,
                p.Category,
                p.Status,
                p.GitHubLink,
                p.LiveDemoLink,
                null,           // ThumbnailPath — not in MVP
                p.ProjectSkills.Select(ps => new SkillDto(ps.Skill.Id, ps.Skill.Name)),
                p.CreatedAt,
                p.UpdatedAt));
        }

        public async Task<ProjectDto> UpdateAsync(int userId, int projectId, UpdateProjectDto dto)
        {
            // ── Validate inputs ───────────────────────────────────────────────
            var errors = new Dictionary<string, string[]>();

            if (dto.Title is not null && (dto.Title.Length < 1 || dto.Title.Length > 200))
                errors[nameof(dto.Title)] = ["Title must be between 1 and 200 characters."];

            if (dto.Description is not null && (dto.Description.Length < 1 || dto.Description.Length > 2000))
                errors[nameof(dto.Description)] = ["Description must be between 1 and 2000 characters."];

            if (dto.Status is not null && dto.Status != "Draft" && dto.Status != "Published")
                errors[nameof(dto.Status)] = ["Status must be 'Draft' or 'Published'."];

            if (dto.GitHubLink is not null && !Uri.TryCreate(dto.GitHubLink, UriKind.Absolute, out _))
                errors[nameof(dto.GitHubLink)] = ["GitHubLink must be a valid URI."];

            if (dto.LiveDemoLink is not null && !Uri.TryCreate(dto.LiveDemoLink, UriKind.Absolute, out _))
                errors[nameof(dto.LiveDemoLink)] = ["LiveDemoLink must be a valid URI."];

            if (errors.Count > 0)
                throw new ValidationException(errors);

            // ── Load CandidateProfile by userId ───────────────────────────────
            var profile = await _unitOfWork
                .GetRepository<CandidateProfile>()
                .GetAll(p => p.UserId == userId)
                .FirstOrDefaultAsync();

            if (profile is null)
                throw new NotFoundException($"Candidate profile for user {userId} was not found.");

            // ── Load project and verify ownership ────────────────────────────
            var project = await _unitOfWork
                .GetRepository<GraduationProject>()
                .GetAll(
                    p => p.Id == projectId,
                    p => p.ProjectSkills)
                .Include(p => p.ProjectSkills)
                    .ThenInclude(ps => ps.Skill)
                .FirstOrDefaultAsync();

            if (project is null || project.CandidateProfileId != profile.Id)
                throw new NotFoundException($"Project {projectId} was not found.");

            // ── Apply partial updates ────────────────────────────────────────
            if (dto.Title is not null)
                project.Title = dto.Title;

            if (dto.Description is not null)
                project.Description = dto.Description;

            if (dto.Category is not null)
                project.Category = dto.Category;

            if (dto.Status is not null)
                project.Status = dto.Status;

            // Treat empty string as "clear the link"
            if (dto.GitHubLink is not null)
                project.GitHubLink = string.IsNullOrWhiteSpace(dto.GitHubLink) ? null : dto.GitHubLink;

            if (dto.LiveDemoLink is not null)
                project.LiveDemoLink = string.IsNullOrWhiteSpace(dto.LiveDemoLink) ? null : dto.LiveDemoLink;

            project.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.GetRepository<GraduationProject>().Update(project);

            // ── Replace skill links if caller provided a new set ─────────────
            if (dto.SkillIds is not null)
            {
                // Remove all existing links
                foreach (var ps in project.ProjectSkills.ToList())
                    _unitOfWork.GetRepository<ProjectSkill>().Delete(ps);

                // Add new links
                foreach (var skillId in dto.SkillIds)
                {
                    _unitOfWork.GetRepository<ProjectSkill>().Add(new ProjectSkill
                    {
                        GraduationProjectId = project.Id,
                        SkillId             = skillId
                    });
                }
            }

            _unitOfWork.SaveChanges();

            // ── Re-query to get fresh skill data ─────────────────────────────
            var updated = await _unitOfWork
                .GetRepository<GraduationProject>()
                .GetAll(
                    p => p.Id == project.Id,
                    p => p.ProjectSkills)
                .Include(p => p.ProjectSkills)
                    .ThenInclude(ps => ps.Skill)
                .FirstOrDefaultAsync();

            var skills = updated!.ProjectSkills
                .Select(ps => new SkillDto(ps.Skill.Id, ps.Skill.Name));

            return new ProjectDto(
                updated.Id,
                updated.CandidateProfileId,
                updated.Title,
                updated.Description,
                updated.Category,
                updated.Status,
                updated.GitHubLink,
                updated.LiveDemoLink,
                null,           // ThumbnailPath — not in MVP
                skills,
                updated.CreatedAt,
                updated.UpdatedAt);
        }

        public async Task DeleteAsync(int userId, int projectId)
        {
            // ── Load CandidateProfile by userId ───────────────────────────────
            var profile = await _unitOfWork
                .GetRepository<CandidateProfile>()
                .GetAll(p => p.UserId == userId)
                .FirstOrDefaultAsync();

            if (profile is null)
                throw new NotFoundException($"Candidate profile for user {userId} was not found.");

            // ── Load project via Find() so it is tracked by the context ──────
            // GetAll() uses AsNoTracking() which returns a detached entity;
            // calling Delete() on a detached entity causes an EF Core
            // InvalidOperationException at runtime.  GetById() uses Find(),
            // which checks the identity map first and always returns a
            // tracked (or newly-tracked) entity.
            var project = _unitOfWork.GetRepository<GraduationProject>().GetById(projectId);

            if (project is null || project.CandidateProfileId != profile.Id)
                throw new NotFoundException($"Project {projectId} was not found.");

            // ── Delete project (EF cascade removes ProjectSkill records) ──────
            _unitOfWork.GetRepository<GraduationProject>().Delete(project);
            _unitOfWork.SaveChanges();
        }

        public Task<ProjectDto> GetByIdAsync(int userId, int projectId)
        {
            throw new NotImplementedException();
        }

        public async Task AddSkillAsync(int userId, int projectId, int skillId)
        {
            // ── Verify project ownership ──────────────────────────────────────
            var profile = await _unitOfWork
                .GetRepository<CandidateProfile>()
                .GetAll(p => p.UserId == userId)
                .FirstOrDefaultAsync();

            if (profile is null)
                throw new NotFoundException($"Candidate profile for user {userId} was not found.");

            var project = await _unitOfWork
                .GetRepository<GraduationProject>()
                .GetAll(p => p.Id == projectId)
                .FirstOrDefaultAsync();

            if (project is null || project.CandidateProfileId != profile.Id)
                throw new NotFoundException($"Project {projectId} was not found.");

            // ── Check skill exists ────────────────────────────────────────────
            var skill = await _unitOfWork
                .GetRepository<Skill>()
                .GetAll(s => s.Id == skillId)
                .FirstOrDefaultAsync();

            if (skill is null)
                throw new NotFoundException($"Skill {skillId} was not found.");

            // ── Check not already linked ──────────────────────────────────────
            var existing = await _unitOfWork
                .GetRepository<ProjectSkill>()
                .GetAll(ps => ps.GraduationProjectId == projectId && ps.SkillId == skillId)
                .FirstOrDefaultAsync();

            if (existing is not null)
                throw new ConflictException($"Skill {skillId} is already linked to project {projectId}.");

            // ── Create the link ───────────────────────────────────────────────
            _unitOfWork.GetRepository<ProjectSkill>().Add(new ProjectSkill
            {
                GraduationProjectId = projectId,
                SkillId             = skillId
            });

            _unitOfWork.SaveChanges();
        }

        public async Task RemoveSkillAsync(int userId, int projectId, int skillId)
        {
            // ── Verify project ownership ──────────────────────────────────────
            var profile = await _unitOfWork
                .GetRepository<CandidateProfile>()
                .GetAll(p => p.UserId == userId)
                .FirstOrDefaultAsync();

            if (profile is null)
                throw new NotFoundException($"Candidate profile for user {userId} was not found.");

            var project = await _unitOfWork
                .GetRepository<GraduationProject>()
                .GetAll(p => p.Id == projectId)
                .FirstOrDefaultAsync();

            if (project is null || project.CandidateProfileId != profile.Id)
                throw new NotFoundException($"Project {projectId} was not found.");

            // ── Check the skill link exists ───────────────────────────────────
            var link = await _unitOfWork
                .GetRepository<ProjectSkill>()
                .GetAll(ps => ps.GraduationProjectId == projectId && ps.SkillId == skillId)
                .FirstOrDefaultAsync();

            if (link is null)
                throw new NotFoundException($"Skill {skillId} is not linked to project {projectId}.");

            // ── Delete the link ───────────────────────────────────────────────
            // AsNoTracking() returns a detached entity; we need a tracked one for Delete().
            var tracked = _unitOfWork.GetRepository<ProjectSkill>().GetById(link.Id);
            _unitOfWork.GetRepository<ProjectSkill>().Delete(tracked!);
            _unitOfWork.SaveChanges();
        }

        public Task<string> UploadThumbnailAsync(int userId, int projectId, IFormFile file)
        {
            throw new NotImplementedException();
        }

        public async Task<PagedResult<ProjectSummaryDto>> BrowseAsync(BrowseProjectsQuery query)
        {
            // ── Validate pagination params (Req 5.6) ──────────────────────────
            var paginationErrors = new Dictionary<string, string[]>();

            if (query.Page < 1)
                paginationErrors["page"] = ["Page must be greater than or equal to 1."];

            if (query.PageSize < 1 || query.PageSize > 50)
                paginationErrors["pageSize"] = ["PageSize must be between 1 and 50."];

            if (paginationErrors.Count > 0)
                throw new ValidationException(paginationErrors);

            var page = query.Page;
            var size = query.PageSize;

            // ── Build base query: Published projects with all required includes ─
            IQueryable<GraduationProject> q = _unitOfWork
                .GetRepository<GraduationProject>()
                .GetAll(
                    p => p.Status == "Published",
                    p => p.ProjectSkills,
                    p => p.CandidateProfile)
                .Include(p => p.ProjectSkills).ThenInclude(ps => ps.Skill)
                .Include(p => p.CandidateProfile).ThenInclude(cp => cp.User);

            // ── Optional filters ──────────────────────────────────────────────

            // Category filter (case-insensitive exact match)
            if (!string.IsNullOrWhiteSpace(query.Category))
            {
                var cat = query.Category.ToLower();
                q = q.Where(p => p.Category.ToLower() == cat);
            }

            // Full-text search on Title or Description (case-insensitive)
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var term = query.Search.ToLower();
                q = q.Where(p => p.Title.ToLower().Contains(term) ||
                                 p.Description.ToLower().Contains(term));
            }

            // Skill IDs — project must have ALL provided skill IDs
            if (query.SkillIds != null)
            {
                foreach (var skillId in query.SkillIds)
                {
                    var sid = skillId; // capture loop variable for EF translation
                    q = q.Where(p => p.ProjectSkills.Any(ps => ps.SkillId == sid));
                }
            }

            // ── Count before pagination ───────────────────────────────────────
            var totalCount = await q.CountAsync();

            // ── Apply pagination ──────────────────────────────────────────────
            var projects = await q
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            // ── Map to ProjectSummaryDto ──────────────────────────────────────
            var items = projects.Select(p => new ProjectSummaryDto(
                p.Id,
                p.Title,
                p.Category,
                p.Status,
                null,   // ThumbnailPath — not in MVP
                p.ProjectSkills.Select(ps => new SkillDto(ps.Skill.Id, ps.Skill.Name)),
                p.CandidateProfile.User.FullName,
                p.CandidateProfile.Field));

            var totalPages = (int)Math.Ceiling((double)totalCount / size);
            return new PagedResult<ProjectSummaryDto>(items, totalCount, page, size, totalPages);
        }

        public async Task<ProjectDetailDto> GetDetailForRecruiterAsync(int projectId)
        {
            // ── Load project with all required related data ────────────────────
            var project = await _unitOfWork
                .GetRepository<GraduationProject>()
                .GetAll(
                    p => p.Id == projectId,
                    p => p.ProjectSkills,
                    p => p.CandidateProfile)
                .Include(p => p.ProjectSkills).ThenInclude(ps => ps.Skill)
                .Include(p => p.CandidateProfile).ThenInclude(cp => cp.User)
                .FirstOrDefaultAsync();

            // ── 404 if not found or not published ────────────────────────────
            if (project is null || project.Status != "Published")
                throw new NotFoundException($"Project {projectId} was not found.");

            var skills = project.ProjectSkills
                .Select(ps => new SkillDto(ps.Skill.Id, ps.Skill.Name));

            return new ProjectDetailDto(
                project.Id,
                project.Title,
                project.Description,
                project.Category,
                project.Status,
                project.GitHubLink,
                project.LiveDemoLink,
                null,   // ThumbnailPath — not in MVP
                skills,
                project.CandidateProfile.User.FullName,
                project.CandidateProfile.Field,
                project.CandidateProfile.ContactEmail,
                project.CandidateProfile.WhatsAppNumber,
                project.CandidateProfile.LinkedInLink);
        }
    }
}
