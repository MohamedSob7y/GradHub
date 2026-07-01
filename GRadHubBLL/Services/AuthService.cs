using GRadHubBLL.DTOs;
using GRadHubBLL.Interfaces;
using GradHubDAL.Unite_Of_Work.Interface;

namespace GRadHubBLL.Services
{
    public class AuthService : IAuthService
    {
        private readonly IuniteOfWork _unitOfWork;

        public AuthService(IuniteOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<AuthResultDto> RegisterAsync(RegisterDto dto)
        {
            throw new NotImplementedException();
        }

        public Task<AuthResultDto> LoginAsync(LoginDto dto)
        {
            throw new NotImplementedException();
        }
    }
}
