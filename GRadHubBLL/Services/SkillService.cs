using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
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

        public Task<IEnumerable<SkillDto>> GetAllAsync()
        {
            throw new NotImplementedException();
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
