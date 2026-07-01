# Implementation Plan: GradHub Platform (MVP)

## Overview

2-week MVP for 4 developers. Tasks follow the DAL → BLL → PL → Frontend layering. No test project. No file uploads. No messaging. No ratings. Skills are seeded, not admin-managed.

**Progress submission in 2 days** — aim to have the backend compiling with auth + student profile + projects working end-to-end by then, plus the React scaffold with login/register visible.

---

## Tasks

### Wave 1 — Fix DAL Foundation (Day 1, all devs can work in parallel after this)

- [x] 1.1 Fix `IGenericRepository<T>` and `GenericRepository<T>`
  - Change `Func<T, bool>` to `Expression<Func<T, bool>>`
  - Change return type from `IEnumerable<T>` to `IQueryable<T>`
  - Add `params Expression<Func<T, object>>[] includes` parameter for eager loading
  - Use `AsNoTracking()`, chain `Include()`, apply `Where()` before returning
  - _This is a prerequisite for every BLL service. Complete it first._

- [x] 1.2 Add `GraduationProject` model and EF configuration
  - `GraduationProject.cs` in `GradHubDAL/Models/`: Id, CandidateProfileId, Title, Description, Category, Status (default "Draft"), GitHubLink, LiveDemoLink, CreatedAt, UpdatedAt
  - `GraduationProjectConfiguration.cs`: cascade delete from CandidateProfile, default Status "Draft"

- [x] 1.3  Add `ProjectSkill` model and EF configuration
  - `ProjectSkill.cs`: Id, GraduationProjectId, SkillId
  - `ProjectSkillConfiguration.cs`: cascade delete from GraduationProject, restrict delete from Skill, unique constraint on (GraduationProjectId, SkillId)

- [x] 1.4 Clean up `CandidateProfile` model
  - Remove `CvFilePath` field (no file upload in MVP)
  - Remove `AverageRating` field (ratings removed from V1)

- [x] 1.5 Clean up `CompanyProfile` model
  - Remove `VerificationStatus` field
  - Remove `IsVerified` field
  - Remove `AverageRating` field

- [x] 1.6 Register new DbSets and add skill seed data
  - Add `DbSet<GraduationProject>` and `DbSet<ProjectSkill>` to `GradHubContext.cs`
  - Remove `DbSet<Rating>` from `GradHubContext.cs` (drop the Rating table)
  - Add `modelBuilder.Entity<Skill>().HasData(...)` with 15–20 common tech skills (C#, React, Python, Java, SQL, JavaScript, TypeScript, Node.js, Angular, Docker, Git, Machine Learning, Flutter, Swift, Kotlin)
  - Run `dotnet ef migrations add MVPSchema` and verify the migration SQL looks correct

- [x] 1.7 Remove `Rating`, `Conversation`, `Message` model files
  - Delete `GradHubDAL/Models/Rating.cs`
  - Delete `GradHubDAL/Configurations/RatingConfiguration.cs`
  - _Note: Conversation and Message models may not exist yet — skip if so_

- [x] 1.8 **Checkpoint**: `dotnet build GradHubDAL` passes with zero errors before moving on.

---

### Wave 2 — PL Infrastructure (Can start in parallel with Wave 1 on a separate branch)

- [x] 2.1 Migrate `GradHubPL` from MVC to pure Web API (`Program.cs`)
  - Replace `AddControllersWithViews()` with `AddControllers()`
  - Replace `MapControllerRoute(...)` with `MapControllers()`
  - Remove `app.MapStaticAssets()`
  - Add `app.UseAuthentication()` before `app.UseAuthorization()`

- [x] 2.2 Delete MVC-only files
  - Delete `Views/`, `Controllers/HomeController.cs`, `Models/ErrorViewModel.cs`
  - Remove Razor/TagHelper NuGet references from `GradHubPL.csproj`

- [x] 2.3 Wire JWT Bearer authentication
  - Add `Microsoft.AspNetCore.Authentication.JwtBearer` NuGet package
  - Wire `AddAuthentication(...).AddJwtBearer(...)` reading from `appsettings.json` `Jwt` section
  - Add `Jwt` section to `appsettings.json` (Key, Issuer, Audience, ExpiryMinutes: 60)

- [x] 2.4 Wire CORS
  - Add `"ReactApp"` policy reading origins from `AllowedOrigins` config
  - Add `"AllowedOrigins": ["http://localhost:5173"]` to `appsettings.json`

- [x] 2.5 Add global exception handler middleware
  - `NotFoundException` → 404, `ConflictException` → 409, `ForbiddenException` → 403, `ValidationException` → 400 with field errors, unhandled → 500
  - Register with `app.UseExceptionHandler` or a custom `IMiddleware`

- [x] 2.6 Register DI services in `Program.cs`
  - `IUnitOfWork`/`UnitOfWork`, `IAuthService`/`AuthService`, `IStudentService`/`StudentService`, `IRecruiterService`/`RecruiterService`, `IProjectService`/`ProjectService`, `ISkillService`/`SkillService`
  - Add `BCrypt.Net-Next` NuGet package

- [x] 2.7 **Checkpoint**: `dotnet build GradHub.sln` passes with zero errors.

---

### Wave 3 — Auth BLL + Controller

- [ ] 3.1 Define BLL exception types in `GRadHubBLL/Exceptions/GradHubExceptions.cs`
  - `NotFoundException(string message)`
  - `ConflictException(string message)`
  - `ForbiddenException(string message)`
  - `ValidationException(Dictionary<string, string[]> errors)`

- [ ] 3.2 Implement `AuthService.RegisterAsync`
  - Validate password length (8–128 chars)
  - Validate role is "Student" or "Recruiter"
  - Check email uniqueness → throw `ConflictException` if taken
  - Hash password: `BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12)`
  - Create `User` record
  - If Student: create `CandidateProfile` (Field="", ExperienceYears=0)
  - If Recruiter: create `CompanyProfile`
  - Call `SaveChangesAsync()`; return `AuthResultDto`

- [ ] 3.3 Implement `AuthService.LoginAsync` + `GenerateToken`
  - Look up user by email; if not found or BCrypt.Verify fails → return 401 result
  - Build JWT with claims: `sub` (userId), `email`, `role`; sign HS256; expiry from config
  - Return `AuthResultDto { Token, ExpiresAt }`

- [ ] 3.4 Implement `AuthController`
  - `POST /api/auth/register` → 201 Created or error
  - `POST /api/auth/login` → 200 OK with token or 401

---

### Wave 4 — Student BLL + Controller

- [ ] 4.1 Implement `StudentService.GetProfileAsync(int userId)`
  - Load `CandidateProfile` by UserId including `CandidateSkills` → `Skill`
  - Map to `CandidateProfileDto`; throw `NotFoundException` if profile missing

- [ ] 4.2 Implement `StudentService.UpdateProfileAsync(int userId, UpdateProfileDto dto)`
  - Validate: `Field` (1–100 chars), `Bio` (≤1000 chars), URL fields (valid URI format)
  - Update and persist; return updated DTO

- [ ] 4.3 Implement `StudentService.AddSkillAsync(int userId, int skillId)`
  - Check skill exists (404 if not)
  - Check not already linked (409 if so)
  - Create `CandidateSkill` record; persist

- [ ] 4.4 Implement `StudentService.RemoveSkillAsync(int userId, int skillId)`
  - Check link exists (404 if not); delete; persist

- [ ] 4.5 Implement `StudentController`
  - `GET /api/students/me` — `[Authorize(Roles = "Student")]`
  - `PUT /api/students/me` — `[Authorize(Roles = "Student")]`
  - `POST /api/students/me/skills` — `[Authorize(Roles = "Student")]`
  - `DELETE /api/students/me/skills/{skillId}` — `[Authorize(Roles = "Student")]`
  - Extract userId from JWT `sub` claim in all actions

---

### Wave 5 — Recruiter BLL + Controller

- [x] 5.1 Implement `RecruiterService.GetProfileAsync(int userId)`
  - Load `CompanyProfile` by UserId; throw `NotFoundException` if missing

- [ ] 5.2 Implement `RecruiterService.UpdateProfileAsync(int userId, UpdateCompanyDto dto)`
  - Validate `CompanyName` (1–150, required), `Industry` (required)
  - Update and persist; return updated DTO

- [ ] 5.3 Implement `RecruiterController`
  - `GET /api/recruiters/me` — `[Authorize(Roles = "Recruiter")]`
  - `PUT /api/recruiters/me` — `[Authorize(Roles = "Recruiter")]`

---

### Wave 6 — Projects BLL + Controller

- [ ] 6.1 Implement `ProjectService.CreateAsync(int userId, CreateProjectDto dto)`
  - Validate Title (1–200), Description (1–2000), Category (required)
  - Create `GraduationProject` (Status="Draft") and any `ProjectSkill` records
  - Persist; return `ProjectDto`

- [ ] 6.2 Implement `ProjectService.GetMyProjectsAsync(int userId)`
  - Return all projects for the student's `CandidateProfile` including skills

- [ ] 6.3 Implement `ProjectService.UpdateAsync(int userId, int projectId, UpdateProjectDto dto)`
  - Verify project belongs to calling student (404 if not)
  - Validate fields; update; set `UpdatedAt = DateTime.UtcNow`; persist

- [ ] 6.4 Implement `ProjectService.DeleteAsync(int userId, int projectId)`
  - Verify ownership (404 if not); delete (EF cascade removes `ProjectSkill` records)

- [ ] 6.5 Implement `ProjectService.AddSkillAsync` and `RemoveSkillAsync`
  - Both: verify project ownership (404)
  - Add: check skill exists (404), check not already linked (409); create `ProjectSkill`
  - Remove: check link exists (404); delete

- [ ] 6.6 Implement `ProjectService.BrowseAsync(BrowseProjectsQuery query)`
  - Filter: `Status = "Published"` always; category if provided; all skill IDs must match; search term on Title + Description (case-insensitive)
  - Paginate: page ≥1, pageSize 1–50; return `PagedResult<ProjectSummaryDto>`

- [ ] 6.7 Implement `ProjectService.GetDetailForRecruiterAsync(int projectId)`
  - Return full project detail including student contact info (ContactEmail, WhatsAppNumber, LinkedInLink)
  - Return 404 if project not found or not published

- [ ] 6.8 Implement `ProjectController`
  - `GET /api/projects` — `[Authorize(Roles = "Recruiter")]` — bind query params to `BrowseProjectsQuery`
  - `GET /api/projects/{id}` — `[Authorize(Roles = "Recruiter")]`
  - `POST /api/projects` — `[Authorize(Roles = "Student")]`
  - `GET /api/projects/me` — `[Authorize(Roles = "Student")]`
  - `PUT /api/projects/{id}` — `[Authorize(Roles = "Student")]`
  - `DELETE /api/projects/{id}` — `[Authorize(Roles = "Student")]`
  - `POST /api/projects/{id}/skills` — `[Authorize(Roles = "Student")]`
  - `DELETE /api/projects/{id}/skills/{skillId}` — `[Authorize(Roles = "Student")]`

---

### Wave 7 — Skills BLL + Controller

- [ ] 7.1 Implement `SkillService.GetAllAsync()`
  - Return all `Skill` records; empty array if none

- [ ] 7.2 Implement `SkillController`
  - `GET /api/skills` — public, no `[Authorize]`

---

### Wave 8 — React Frontend

- [ ] 8.1 Set up feature-folder structure and shared infrastructure
  - Create folders: `auth/`, `student/`, `projects/`, `recruiter/`, `shared/`
  - `shared/api/axiosInstance.ts`: axios instance with base URL from env, JWT Bearer interceptor (reads from `localStorage`)
  - `shared/types.ts`: TypeScript types matching API DTOs
  - Install `react-router-dom` if not present

- [ ] 8.2 Configure routing in `App.tsx`
  - Public routes: `/login`, `/register`
  - Student routes: `/profile`, `/projects/me`, `/projects/me/new`, `/projects/:id/edit`
  - Recruiter routes: `/browse`, `/browse/:id`, `/recruiter/profile`
  - Implement `ProtectedRoute` component: reads JWT from localStorage, decodes role, redirects if unauthenticated or wrong role

- [ ] 8.3 Implement auth feature
  - `auth/authApi.ts`: `login(dto)` → stores JWT in localStorage; `register(dto)`; `logout()` → clears localStorage
  - `auth/LoginPage.tsx`: email + password form; on success redirect based on role
  - `auth/RegisterPage.tsx`: fullName, email, password, role select; on success redirect to `/login`

- [ ] 8.4 Implement student profile feature
  - `student/studentApi.ts`: `getProfile()`, `updateProfile(dto)`, `addSkill(skillId)`, `removeSkill(skillId)`
  - `student/ProfilePage.tsx`: display all profile fields + skills list with remove buttons + skill-add dropdown (populated from `GET /api/skills`)
  - `student/EditProfilePage.tsx`: form bound to `UpdateProfileDto`; client-side validation

- [ ] 8.5 Implement projects feature (student side)
  - `projects/projectApi.ts`: `createProject(dto)`, `getMyProjects()`, `updateProject(id, dto)`, `deleteProject(id)`, `addSkill(projectId, skillId)`, `removeSkill(projectId, skillId)`, `browseProjects(query)`, `getProjectDetail(id)`
  - `projects/MyProjectsPage.tsx`: list of own projects with edit/delete actions and publish toggle
  - `projects/ProjectFormPage.tsx`: create/edit form with skill multi-select

- [ ] 8.6 Implement recruiter browse feature
  - `recruiter/BrowsePage.tsx`: paginated project cards with category filter, skill multi-filter, search input (debounced)
  - `recruiter/ProjectDetailPage.tsx`: full project detail with student contact info displayed
  - `recruiter/RecruiterProfilePage.tsx`: display and edit form for `CompanyProfile`

---

### Phase 2 — Messaging (Build after MVP demo)

> Do not start these until all Phase 1 tasks are marked complete.

- [ ] 9.1 Add `Conversation` and `Message` models + EF configuration + migration
- [ ] 9.2 Implement `MessagingService` (StartConversation, Reply, ListConversations, GetConversation)
- [ ] 9.3 Implement `MessagingController` (`/api/conversations`)
- [ ] 9.4 Implement `messaging/` React feature folder (InboxPage, ConversationPage)

---

## Notes

- Tasks in Waves 3–7 can be split among 4 devs by domain: one dev per Wave works well.
- Wave 8 (frontend) can start as soon as Wave 2 checkpoint passes — the API doesn't need to be fully done, use mock data or hardcoded responses initially.
- Skills admin UI is intentionally omitted — seed the data in EF. This saves ~1 day of work.
- The messaging feature (Phase 2) is fully designed and ready to implement after the MVP is demoed.
- Do not add the `GradHub.Tests` project. Manual testing against the running API is sufficient for the progress submission.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "name": "DAL Foundation", "tasks": ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7"] },
    { "id": 1, "name": "PL Infrastructure", "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6"] },
    { "id": 2, "name": "Auth", "tasks": ["3.1", "3.2", "3.3", "3.4"], "dependsOn": [0, 1] },
    { "id": 3, "name": "Student", "tasks": ["4.1", "4.2", "4.3", "4.4", "4.5"], "dependsOn": [2] },
    { "id": 4, "name": "Recruiter", "tasks": ["5.1", "5.2", "5.3"], "dependsOn": [2] },
    { "id": 5, "name": "Projects", "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7", "6.8"], "dependsOn": [2] },
    { "id": 6, "name": "Skills", "tasks": ["7.1", "7.2"], "dependsOn": [0] },
    { "id": 7, "name": "Frontend", "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6"], "dependsOn": [1] }
  ]
}
```
