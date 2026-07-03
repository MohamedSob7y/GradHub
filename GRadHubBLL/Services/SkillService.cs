using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
using GradHubDAL.Models;
using GradHubDAL.Unite_Of_Work.Interface;

namespace GRadHubBLL.Services
{
    public class SkillService : ISkillService
    {
        private readonly IuniteOfWork _unitOfWork;

        public SkillService(IuniteOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<SkillDto>> GetAllAsync()
        {
            var skills = _unitOfWork
                .GetRepository<Skill>()
                .GetAll()
                .OrderBy(s => s.Name)
                .Select(s => new SkillDto(s.Id, s.Name))
                .ToList();

            return await Task.FromResult(skills);
        }

        public Task<SkillDto> CreateAsync(string name)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int skillId)
        {
            throw new NotImplementedException();
        }
    }
}
