using GRadHubBLL.DTOs;
using GRadHubBLL.Exceptions;
using GRadHubBLL.Interfaces;
using GradHubDAL.Models;
using GradHubDAL.Unite_Of_Work.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace GRadHubBLL.Services
{
    public class StudentService : IStudentService
    {
        private readonly IuniteOfWork _unitOfWork;

        public StudentService(IuniteOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<CandidateProfileDto> GetProfileAsync(int userId)
        {
            var profile = await _unitOfWork
                .GetRepository<CandidateProfile>()
                .GetAll(
                    p => p.UserId == userId,
                    p => p.User,
                    p => p.CandidateSkills)
                .Include(p => p.CandidateSkills)
                    .ThenInclude(cs => cs.Skill)
                .FirstOrDefaultAsync();

            if (profile is null)
                throw new NotFoundException($"Candidate profile for user {userId} was not found.");

            var skills = profile.CandidateSkills
                .Select(cs => new SkillDto(cs.Skill.Id, cs.Skill.Name));

            return new CandidateProfileDto(
                profile.Id,
                profile.UserId,
                profile.User.FullName,
                profile.Field,
                profile.Bio,
                profile.ExperienceYears,
                profile.GraduationProjectLink,
                profile.PortfolioLink,
                profile.LinkedInLink,
                profile.WhatsAppNumber,
                profile.ContactEmail,
                skills);
        }

        public async Task<CandidateProfileDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            // ── Load profile with its relations ──────────────────────────────
            var profile = await _unitOfWork
                .GetRepository<CandidateProfile>()
                .GetAll(
                    p => p.UserId == userId,
                    p => p.User,
                    p => p.CandidateSkills)
                .Include(p => p.CandidateSkills)
                    .ThenInclude(cs => cs.Skill)
                .FirstOrDefaultAsync();

            if (profile is null)
                throw new NotFoundException($"Candidate profile for user {userId} was not found.");

            // ── Validate provided fields ──────────────────────────────────────
            var errors = new Dictionary<string, string[]>();

            if (dto.Field is not null)
            {
                if (dto.Field.Length < 1 || dto.Field.Length > 100)
                    errors[nameof(dto.Field)] = ["Field must be between 1 and 100 characters."];
            }

            if (dto.Bio is not null)
            {
                if (dto.Bio.Length > 1000)
                    errors[nameof(dto.Bio)] = ["Bio must not exceed 1000 characters."];
            }

            foreach (var (key, value) in new[]
            {
                (nameof(dto.GraduationProjectLink), dto.GraduationProjectLink),
                (nameof(dto.PortfolioLink),         dto.PortfolioLink),
                (nameof(dto.LinkedInLink),          dto.LinkedInLink),
            })
            {
                if (value is not null &&
                    !Uri.TryCreate(value, UriKind.Absolute, out _))
                {
                    errors[key] = [$"{key} must be a valid absolute URL."];
                }
            }

            if (errors.Count > 0)
                throw new Exceptions.ValidationException(errors);

            // ── Apply partial update (only non-null properties) ───────────────
            if (dto.Field               is not null) profile.Field                  = dto.Field;
            if (dto.Bio                 is not null) profile.Bio                    = dto.Bio;
            if (dto.ExperienceYears     is not null) profile.ExperienceYears        = dto.ExperienceYears.Value;
            if (dto.GraduationProjectLink is not null) profile.GraduationProjectLink = dto.GraduationProjectLink;
            if (dto.PortfolioLink       is not null) profile.PortfolioLink          = dto.PortfolioLink;
            if (dto.LinkedInLink        is not null) profile.LinkedInLink           = dto.LinkedInLink;
            if (dto.WhatsAppNumber      is not null) profile.WhatsAppNumber         = dto.WhatsAppNumber;
            if (dto.ContactEmail        is not null) profile.ContactEmail           = dto.ContactEmail;

            // ── Persist ───────────────────────────────────────────────────────
            _unitOfWork.GetRepository<CandidateProfile>().Update(profile);
            _unitOfWork.SaveChanges();

            // ── Project to DTO ────────────────────────────────────────────────
            var skills = profile.CandidateSkills
                .Select(cs => new SkillDto(cs.Skill.Id, cs.Skill.Name));

            return new CandidateProfileDto(
                profile.Id,
                profile.UserId,
                profile.User.FullName,
                profile.Field,
                profile.Bio,
                profile.ExperienceYears,
                profile.GraduationProjectLink,
                profile.PortfolioLink,
                profile.LinkedInLink,
                profile.WhatsAppNumber,
                profile.ContactEmail,
                skills);
        }

        public Task<string> UploadCvAsync(int userId, IFormFile file)
        {
            throw new NotImplementedException();
        }

        public async Task AddSkillAsync(int userId, int skillId)
        {
            // ── 1. Load candidate profile by UserId ───────────────────────────
            var profile = await _unitOfWork
                .GetRepository<CandidateProfile>()
                .GetAll(p => p.UserId == userId)
                .FirstOrDefaultAsync();

            if (profile is null)
                throw new NotFoundException($"Candidate profile for user {userId} was not found.");

            // ── 2. Verify the skill exists ────────────────────────────────────
            var skillExists = await _unitOfWork
                .GetRepository<Skill>()
                .GetAll(s => s.Id == skillId)
                .AnyAsync();

            if (!skillExists)
                throw new NotFoundException($"Skill with id {skillId} was not found.");

            // ── 3. Guard against duplicates ───────────────────────────────────
            var alreadyLinked = await _unitOfWork
                .GetRepository<CandidateSkill>()
                .GetAll(cs => cs.CandidateProfileId == profile.Id && cs.SkillId == skillId)
                .AnyAsync();

            if (alreadyLinked)
                throw new ConflictException($"Skill {skillId} is already added to the profile of user {userId}.");

            // ── 4. Create and persist the link ────────────────────────────────
            var candidateSkill = new CandidateSkill
            {
                CandidateProfileId = profile.Id,
                SkillId            = skillId
            };

            _unitOfWork.GetRepository<CandidateSkill>().Add(candidateSkill);
            _unitOfWork.SaveChanges();
        }  
       
       public async Task RemoveSkillAsync(int userId, int skillId)
        {
            // ── 1. Load candidate profile by UserId ───────────────────────────
            var profile = await _unitOfWork
                .GetRepository<CandidateProfile>()
                .GetAll(p => p.UserId == userId)
                .FirstOrDefaultAsync();

            if (profile is null)
                throw new NotFoundException($"Candidate profile for user {userId} was not found.");

            // ── 2. Find the CandidateSkill link ───────────────────────────────
            var candidateSkill = await _unitOfWork
                .GetRepository<CandidateSkill>()
                .GetAll(cs => cs.CandidateProfileId == profile.Id && cs.SkillId == skillId)
                .FirstOrDefaultAsync();

            if (candidateSkill is null)
                throw new NotFoundException($"Skill {skillId} is not linked to the profile of user {userId}.");

            // ── 3. Delete and persist ─────────────────────────────────────────
            _unitOfWork.GetRepository<CandidateSkill>().Delete(candidateSkill);
            _unitOfWork.SaveChanges();
}
    }
}
