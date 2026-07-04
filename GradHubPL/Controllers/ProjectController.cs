using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GradHubPL.Controllers
{
    [ApiController]
    [Route("api/projects")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        /// <summary>
        /// Extracts the current user's ID from the JWT "sub" claim.
        /// Throws <see cref="UnauthorizedAccessException"/> if the claim is missing.
        /// </summary>
        private int GetCurrentUserId() =>
            int.Parse(User.FindFirst("sub")?.Value
                ?? throw new UnauthorizedAccessException("Missing 'sub' claim in JWT."));

        // ── Recruiter endpoints ────────────────────────────────────────────────

        /// <summary>
        /// GET /api/projects — browse published projects with optional filters (Recruiter only).
        /// Query params: page, pageSize, category, skillId[], search
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Recruiter")]
        [ProducesResponseType(typeof(PagedResult<ProjectSummaryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> Browse(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? category = null,
            [FromQuery(Name = "skillId")] IEnumerable<int>? skillIds = null,
            [FromQuery] string? search = null)
        {
            var query = new BrowseProjectsQuery(page, pageSize, category, skillIds, search);
            var result = await _projectService.BrowseAsync(query);
            return Ok(result);
        }

        // ── Student "me" endpoint — declared BEFORE {id} to avoid routing ambiguity ──

        /// <summary>
        /// GET /api/projects/me — returns all projects owned by the authenticated student.
        /// </summary>
        [HttpGet("me")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(typeof(IEnumerable<ProjectDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetMyProjects()
        {
            var projects = await _projectService.GetMyProjectsAsync(GetCurrentUserId());
            return Ok(projects);
        }

        // ── Recruiter {id} endpoint — after "me" to prevent "me" matching as int ──

        /// <summary>
        /// GET /api/projects/{id} — returns full project detail including student contact info (Recruiter only).
        /// </summary>
        [HttpGet("{id:int}")]
        [Authorize(Roles = "Recruiter")]
        [ProducesResponseType(typeof(ProjectDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetDetail(int id)
        {
            var detail = await _projectService.GetDetailForRecruiterAsync(id);
            return Ok(detail);
        }

        // ── Student CRUD endpoints ─────────────────────────────────────────────

        /// <summary>
        /// POST /api/projects — creates a new graduation project for the authenticated student.
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
        {
            var project = await _projectService.CreateAsync(GetCurrentUserId(), dto);
            return StatusCode(StatusCodes.Status201Created, project);
        }

        /// <summary>
        /// PUT /api/projects/{id} — updates an existing project owned by the authenticated student.
        /// </summary>
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProjectDto dto)
        {
            var updated = await _projectService.UpdateAsync(GetCurrentUserId(), id, dto);
            return Ok(updated);
        }

        /// <summary>
        /// DELETE /api/projects/{id} — deletes a project owned by the authenticated student.
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            await _projectService.DeleteAsync(GetCurrentUserId(), id);
            return NoContent();
        }

        // ── Project skill management (Student) ────────────────────────────────

        /// <summary>
        /// POST /api/projects/{id}/skills — adds a skill to a project owned by the authenticated student.
        /// Body: { "skillId": int }
        /// </summary>
        [HttpPost("{id:int}/skills")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> AddSkill(int id, [FromBody] AddProjectSkillRequest request)
        {
            await _projectService.AddSkillAsync(GetCurrentUserId(), id, request.SkillId);
            return NoContent();
        }

        /// <summary>
        /// DELETE /api/projects/{id}/skills/{skillId} — removes a skill from a project owned by the authenticated student.
        /// </summary>
        [HttpDelete("{id:int}/skills/{skillId:int}")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveSkill(int id, int skillId)
        {
            await _projectService.RemoveSkillAsync(GetCurrentUserId(), id, skillId);
            return NoContent();
        }
    }

    /// <summary>Request body for POST /api/projects/{id}/skills.</summary>
    public record AddProjectSkillRequest(int SkillId);
}
