using GRadHubBLL.DTOs;

namespace GRadHubBLL.Interfaces
{
    public interface ISkillService
    {
        Task<IEnumerable<SkillDto>> GetAllAsync();
        Task<SkillDto> CreateAsync(string name);
        Task DeleteAsync(int skillId);
    }
}
