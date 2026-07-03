using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GradHubPL.Controllers
{
    [ApiController]
    [Route("api/skills")]
    public class SkillController : ControllerBase
    {
        private readonly ISkillService _skillService;

        public SkillController(ISkillService skillService)
        {
            _skillService = skillService;
        }

        /// <summary>
        /// GET /api/skills — returns all skills (public, no authorization required).
        /// Skills are seeded in the database — no admin CRUD needed for MVP.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<SkillDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var skills = await _skillService.GetAllAsync();
            return Ok(skills);
        }
    }
}
