using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GRadHubBLL.DTOs;
using GRadHubBLL.Exceptions;
using GRadHubBLL.Interfaces;
using GradHubDAL.Models;
using GradHubDAL.Unite_Of_Work.Interface;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace GRadHubBLL.Services
{
    public class AuthService : IAuthService
    {
        private readonly IuniteOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public AuthService(IuniteOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<AuthResultDto> RegisterAsync(RegisterDto dto)
        {
            // ── Validate password length ──────────────────────────────────────
            var errors = new Dictionary<string, string[]>();

            if (dto.Password.Length < 8 || dto.Password.Length > 128)
                errors["password"] = ["Password must be between 8 and 128 characters."];

            if (dto.Role != "Student" && dto.Role != "Recruiter")
                errors["role"] = ["Role must be 'Student' or 'Recruiter'."];

            if (errors.Count > 0)
                throw new ValidationException(errors);

            // ── Check email uniqueness ────────────────────────────────────────
            var emailTaken = _unitOfWork
                .GetRepository<User>()
                .GetAll(u => u.Email == dto.Email)
                .Any();

            if (emailTaken)
                throw new ConflictException("A user with this email is already registered.");

            // ── Hash password ─────────────────────────────────────────────────
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, workFactor: 12);

            // ── Create User ───────────────────────────────────────────────────
            var user = new User
            {
                FullName     = dto.FullName,
                Email        = dto.Email,
                PasswordHash = passwordHash,
                Role         = dto.Role,
                CreatedAt    = DateTime.UtcNow
            };

            _unitOfWork.GetRepository<User>().Add(user);
            _unitOfWork.SaveChanges(); // flush so user.Id is populated

            // ── Create role-specific profile ──────────────────────────────────
            if (dto.Role == "Student")
            {
                var candidateProfile = new CandidateProfile
                {
                    UserId          = user.Id,
                    Field           = string.Empty,
                    ExperienceYears = 0,
                    CreatedAt       = DateTime.UtcNow
                };
                _unitOfWork.GetRepository<CandidateProfile>().Add(candidateProfile);
            }
            else // Recruiter
            {
                var companyProfile = new CompanyProfile
                {
                    UserId      = user.Id,
                    CompanyName = "Company Name", // Placeholder — recruiter must complete profile
                    Industry    = "Industry",     // Placeholder — recruiter must complete profile
                    CreatedAt   = DateTime.Now
                };
                _unitOfWork.GetRepository<CompanyProfile>().Add(companyProfile);
            }

            _unitOfWork.SaveChanges();

            // ── Issue JWT ─────────────────────────────────────────────────────
            return await Task.FromResult(GenerateToken(user));
        }

        public async Task<AuthResultDto> LoginAsync(LoginDto dto)
        {
            // ── Look up user by email ─────────────────────────────────────────
            var user = _unitOfWork
                .GetRepository<User>()
                .GetAll(u => u.Email == dto.Email)
                .FirstOrDefault();

            // Generic 401 — do not reveal which field is wrong
            if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid email or password.");

            return await Task.FromResult(GenerateToken(user));
        }

        // ── Private helper ────────────────────────────────────────────────────
        private AuthResultDto GenerateToken(User user)
        {
            var jwtSection = _configuration.GetSection("Jwt");
            var key        = jwtSection["Key"]
                ?? throw new InvalidOperationException("Jwt:Key is not configured.");
            var issuer     = jwtSection["Issuer"] ?? "GradHubAPI";
            var audience   = jwtSection["Audience"] ?? "GradHubClient";
            var expiryMins = int.TryParse(jwtSection["ExpiryMinutes"], out var m) ? m : 60;

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
            var expiresAt  = DateTime.UtcNow.AddMinutes(expiryMins);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,   user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier,     user.Id.ToString()),
                new Claim(ClaimTypes.Role,               user.Role),
            };

            var token = new JwtSecurityToken(
                issuer:             issuer,
                audience:           audience,
                claims:             claims,
                expires:            expiresAt,
                signingCredentials: credentials);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return new AuthResultDto(tokenString, expiresAt);
        }
    }
}
