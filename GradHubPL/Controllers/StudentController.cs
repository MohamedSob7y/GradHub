using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GradHubPL.Controllers
{
    [ApiController]
    [Route("api/students")]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        /// <summary>
        /// Extracts the current user's ID from the JWT "sub" claim.
        /// Throws <see cref="UnauthorizedAccessException"/> if the claim is missing.
        /// </summary>
        private int GetCurrentUserId() =>
            int.Parse(User.FindFirst("sub")?.Value
                ?? throw new UnauthorizedAccessException("Missing 'sub' claim in JWT."));

        /// <summary>
        /// GET /api/students/me — returns the authenticated student's profile including skills.
        /// </summary>
        [HttpGet("me")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(typeof(CandidateProfileDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetProfile()
        {
            var profile = await _studentService.GetProfileAsync(GetCurrentUserId());
            return Ok(profile);
        }

        /// <summary>
        /// PUT /api/students/me — updates the authenticated student's profile.
        /// </summary>
        [HttpPut("me")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(typeof(CandidateProfileDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var updated = await _studentService.UpdateProfileAsync(GetCurrentUserId(), dto);
            return Ok(updated);
        }

        /// <summary>
        /// POST /api/students/me/skills — adds a skill to the authenticated student's profile.
        /// Body: { "skillId": int }
        /// </summary>
        [HttpPost("me/skills")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> AddSkill([FromBody] AddSkillRequest request)
        {
            await _studentService.AddSkillAsync(GetCurrentUserId(), request.SkillId);
            return StatusCode(StatusCodes.Status201Created);
        }

        /// <summary>
        /// DELETE /api/students/me/skills/{skillId} — removes a skill from the authenticated student's profile.
        /// </summary>
        [HttpDelete("me/skills/{skillId:int}")]
        [Authorize(Roles = "Student")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> RemoveSkill(int skillId)
        {
            await _studentService.RemoveSkillAsync(GetCurrentUserId(), skillId);
            return Ok();
        }
    }

    /// <summary>Request body for POST /api/students/me/skills.</summary>
    public record AddSkillRequest(int SkillId);
}
