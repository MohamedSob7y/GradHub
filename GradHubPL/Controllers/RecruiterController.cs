using System.Security.Claims;
using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GradHubPL.Controllers
{
    [ApiController]
    [Route("api/recruiters")]
    public class RecruiterController : ControllerBase
    {
        private readonly IRecruiterService _recruiterService;

        public RecruiterController(IRecruiterService recruiterService)
        {
            _recruiterService = recruiterService;
        }

        /// <summary>
        /// GET /api/recruiters/me — returns the authenticated recruiter's company profile.
        /// </summary>
        [HttpGet("me")]
        [Authorize(Roles = "Recruiter")]
        public async Task<ActionResult<CompanyProfileDto>> GetMyProfile()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            CompanyProfileDto profile = await _recruiterService.GetProfileAsync(userId);
            return Ok(profile);
        }

        /// <summary>
        /// PUT /api/recruiters/me — updates the authenticated recruiter's company profile.
        /// </summary>
        [HttpPut("me")]
        [Authorize(Roles = "Recruiter")]
        public async Task<ActionResult<CompanyProfileDto>> UpdateMyProfile([FromBody] UpdateCompanyDto dto)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            CompanyProfileDto updated = await _recruiterService.UpdateProfileAsync(userId, dto);
            return Ok(updated);
        }
    }
}
