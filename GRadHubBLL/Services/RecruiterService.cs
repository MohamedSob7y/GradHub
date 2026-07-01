using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
using GradHubDAL.Unite_Of_Work.Interface;

namespace GRadHubBLL.Services
{
    public class RecruiterService : IRecruiterService
    {
        private readonly IuniteOfWork _unitOfWork;

        public RecruiterService(IuniteOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<CompanyProfileDto> GetProfileAsync(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<CompanyProfileDto> UpdateProfileAsync(int userId, UpdateCompanyDto dto)
        {
            throw new NotImplementedException();
        }
    }
}
