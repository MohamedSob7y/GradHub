# Requirements Document

## Introduction

GradHub is a web platform that connects Computer Science and IT graduation students with HR recruiters. Instead of the traditional model where companies post jobs and wait for applications, GradHub flips the dynamic: students build rich profiles showcasing their graduation projects, and recruiters actively browse and contact students they are interested in.

The platform is built with an ASP.NET Core Web API backend and a React frontend. The backend is a pure REST API — it exposes JSON endpoints only and contains no Razor views or MVC controllers that return HTML. The React application lives in a separate `frontend/` folder at the repository root, alongside the .NET solution, and communicates with the API exclusively over HTTP. The existing codebase has a Data Access Layer (DAL) with EF Core, a Generic Repository + Unit of Work pattern, and an empty Business Logic Layer (BLL) project. The architecture will be migrated from MVC to a proper API + React SPA model as part of this platform build.

The `frontend/` project is organized by feature rather than by technical layer. Top-level feature folders (e.g., `auth`, `student-profile`, `projects`, `recruiter`, `messaging`) each own their components, hooks, and any feature-specific utilities, rather than having global `components/`, `pages/`, and `hooks/` folders at the project root.

---

## Glossary

- **System**: The GradHub web platform as a whole
- **API**: The ASP.NET Core Web API backend (GradHubPL project, restructured as a pure REST API with no Razor views or MVC HTML responses)
- **Frontend**: The React single-page application located in the `frontend/` folder at the repository root, organized by feature (e.g., `auth`, `student-profile`, `projects`, `recruiter`, `messaging`)
- **BLL**: The Business Logic Layer (GradHubBLL project) that contains all service classes and business rules
- **DAL**: The Data Access Layer (GradHubDAL project) containing EF Core models, DbContext, Generic Repository, and Unit of Work
- **Student**: A registered user with the role "Student" who is a CS/IT graduate or graduating student
- **Recruiter**: A registered user with the role "Recruiter" who represents a company seeking to hire students
- **GraduationProject**: A project created and owned by a Student, representing their graduation work
- **CandidateProfile**: The extended profile of a Student, containing bio, CV, skills, and links to graduation projects
- **CompanyProfile**: The extended profile of a Recruiter, containing company information and contact details
- **Skill**: A technology or skill tag (e.g., "React", "C#", "Python") that can be associated with a Student or a GraduationProject
- **Message**: A communication record sent from a Recruiter to a Student to initiate a conversation, or a reply sent within an existing conversation thread
- **Conversation**: A threaded exchange between one Recruiter and one Student, initiated by the Recruiter; consists of one parent Message and zero or more reply Messages
- **JWT**: JSON Web Token used for stateless authentication between the React Frontend and the API
- **UnitOfWork**: The existing Unit of Work pattern implementation in the DAL used to coordinate repository operations and save changes
- **GenericRepository**: The existing generic repository in the DAL providing standard CRUD operations for any entity

---

## Requirements

### Requirement 1: Architecture Migration

**User Story:** As a development team, we want to migrate the existing MVC project to a REST API + React SPA architecture, so that the backend and frontend are properly decoupled and the BLL layer is populated with business logic.

#### Acceptance Criteria

1. THE API SHALL expose all endpoints as RESTful HTTP endpoints returning JSON responses; THE API SHALL NOT serve Razor views, HTML responses, or any MVC-rendered pages.
2. THE BLL SHALL contain one service class per domain area (AuthService, StudentService, RecruiterService, ProjectService, SkillService, MessagingService) that encapsulate all business logic; controllers in the API SHALL only read request data, call the appropriate BLL service method, and return the result — they SHALL NOT contain domain logic, conditional branching based on business rules, or data validation beyond model binding.
3. THE DAL SHALL be extended to include a `GraduationProject` entity, a `ProjectSkill` join entity, a `Message` entity, and a `Conversation` entity to support graduation project and messaging functionality not yet present in the existing models.
4. THE API SHALL configure JWT Bearer authentication using ASP.NET Core's built-in middleware, with a configurable access token lifetime between 15 and 60 minutes, replacing any session or cookie-based authentication.
5. THE API SHALL configure CORS to allow requests from the React Frontend origin as defined in application settings, and SHALL handle OPTIONS preflight requests correctly.
6. THE UnitOfWork SHALL remain the single point of interaction between the BLL and the DAL, with all BLL service classes receiving `IUnitOfWork` through constructor injection.
7. THE Frontend SHALL be organized by feature; each feature folder (e.g., `auth`, `student-profile`, `projects`, `recruiter`, `messaging`) SHALL contain only: page-level components, sub-components specific to that feature, custom hooks used only by that feature, and a feature-level API service file. Shared code used by more than one feature SHALL live in a top-level `shared/` folder.

---

### Requirement 2: User Authentication

**User Story:** As a visitor, I want to register and log in as either a Student or a Recruiter, so that I can access role-specific features of the platform.

#### Acceptance Criteria

1. WHEN a visitor submits a registration request with a full name, email, password, and role of "Student", THE API SHALL create a new `User` record and a `CandidateProfile` record with `Field` set to an empty string, `ExperienceYears` set to 0, and all optional fields set to null.
2. WHEN a visitor submits a registration request with a full name, email, password, and role of "Recruiter", THE API SHALL create a new `User` record and a `CompanyProfile` record with `VerificationStatus` set to "Pending", `IsVerified` set to false, and all optional fields set to null.
3. WHEN a visitor submits a registration request with an email that already exists in the `Users` table, THE API SHALL return a 400 Bad Request response with an error message stating the email is already registered.
4. IF a visitor submits a registration request with a password shorter than 8 characters or longer than 128 characters, THEN THE API SHALL return a 400 Bad Request response with a validation error identifying the password field.
5. IF a visitor submits a registration request with a role value other than "Student" or "Recruiter", THEN THE API SHALL return a 400 Bad Request response with a validation error identifying the role field.
6. THE API SHALL store passwords as bcrypt hashes and SHALL NOT store plain-text passwords at any point.
7. WHEN a visitor submits a login request with a valid email and matching password, THE API SHALL return a signed JWT containing the user's ID, email, and role, with an expiry matching the configured access token lifetime.
8. IF a visitor submits a login request with an email that does not exist or a password that does not match, THEN THE API SHALL return a 401 Unauthorized response with a generic error message that does not reveal which field is incorrect.
9. IF an authenticated request arrives without a valid JWT in the Authorization header, THEN THE API SHALL return a 401 Unauthorized response.
10. IF an authenticated request is made by a user attempting to access an endpoint restricted to a different role, THEN THE API SHALL return a 403 Forbidden response.

---

### Requirement 3: Student Profile Management

**User Story:** As a Student, I want to edit my profile with my personal information, bio, CV, and links, so that recruiters can learn about me and my background.

#### Acceptance Criteria

1. WHEN an authenticated Student sends a request to retrieve their own profile, THE API SHALL return the student's `CandidateProfile` data including full name, university field, bio, experience years, CV file path, graduation project link, portfolio link, LinkedIn link, WhatsApp number, contact email, average rating, and associated skills.
2. WHEN an authenticated Student sends a request to update their profile with valid data, THE API SHALL update the corresponding `CandidateProfile` record and return the updated profile. Valid data means: `Field` is 1–100 characters if provided; `Bio` is at most 1000 characters if provided; all link fields are valid URL strings if provided.
3. IF an authenticated Student sends a profile update request with invalid data, THEN THE API SHALL return a 400 Bad Request response identifying the invalid fields.
4. WHEN an authenticated Student sends a CV upload request with a valid PDF or DOCX file not exceeding 5MB, THE API SHALL save the file to server storage and update the `CvFilePath` field in the student's `CandidateProfile`.
5. IF an authenticated Student sends a CV upload request with a file exceeding 5MB, THEN THE API SHALL return a 400 Bad Request response with an error message indicating the file size limit.
6. IF an authenticated Student sends a CV upload request with a file type other than PDF or DOCX, THEN THE API SHALL return a 400 Bad Request response with an error message indicating the allowed file types.
7. WHEN an authenticated Student sends a request to add a skill by skill ID, THE API SHALL create a `CandidateSkill` record linking the student's `CandidateProfile` to the specified `Skill`.
8. IF an authenticated Student sends a request to add a skill with a skill ID that does not exist in the `Skills` table, THEN THE API SHALL return a 404 Not Found response.
9. IF an authenticated Student sends a request to add a skill that is already linked to their profile, THEN THE API SHALL return a 409 Conflict response.
10. WHEN an authenticated Student sends a request to remove a skill by skill ID, THE API SHALL delete the corresponding `CandidateSkill` record.
11. IF an authenticated Student sends a request to remove a skill that is not linked to their profile, THEN THE API SHALL return a 404 Not Found response.

---

### Requirement 4: Graduation Project Management

**User Story:** As a Student, I want to upload and manage my graduation project with its title, description, tech stack, category, and links, so that recruiters can discover my work.

#### Acceptance Criteria

1. WHEN an authenticated Student sends a request to create a graduation project with a title (1–200 characters), description (1–2000 characters), category, and at least one skill ID, THE API SHALL create a new `GraduationProject` record linked to the Student's `CandidateProfile` and return the created project.
2. WHEN an authenticated Student sends a request to update their graduation project with valid data (title 1–200 chars, description 1–2000 chars if provided), THE API SHALL update the `GraduationProject` record and return the updated project.
3. WHEN an authenticated Student sends a request to delete their graduation project, THE API SHALL delete the `GraduationProject` record and all associated `ProjectSkill` records.
4. WHEN an authenticated Student sends a request to retrieve their graduation project, THE API SHALL return the project details including title, description, category, status, tech stack (list of skills), GitHub link, live demo link, and thumbnail image path.
5. WHEN an authenticated Student sends a request to add a skill to their graduation project by skill ID, THE API SHALL create a `ProjectSkill` record linking the project to the specified `Skill`.
6. IF an authenticated Student sends a graduation project creation request with a missing or empty title, description, or category, THEN THE API SHALL return a 400 Bad Request response listing the missing or invalid fields.
7. WHEN an authenticated Student sends a request to upload a project thumbnail image in JPG or PNG format not exceeding 2MB, THE API SHALL save the file and update the thumbnail path on the `GraduationProject` record.
8. IF an authenticated Student sends a request to update, delete, retrieve, or add a skill to a graduation project that does not exist or does not belong to them, THEN THE API SHALL return a 404 Not Found response.
9. IF an authenticated Student sends a request to add a skill to their graduation project that is already associated with that project via a `ProjectSkill` record, THEN THE API SHALL return a 409 Conflict response.
10. IF an authenticated Student sends a thumbnail upload request with a file type other than JPG or PNG, or a file exceeding 2MB, THEN THE API SHALL return a 400 Bad Request response identifying the constraint violated.

---

### Requirement 5: Project Discovery for Recruiters

**User Story:** As a Recruiter, I want to browse, search, and filter graduation projects, so that I can efficiently find students whose work matches my hiring needs.

#### Acceptance Criteria

1. WHEN an authenticated Recruiter sends a request to list graduation projects, THE API SHALL return a paginated list of `GraduationProject` records with `Status` equal to "Published", with each item including the project title, category, tech stack, and the student's full name and university field.
2. WHEN an authenticated Recruiter sends a request to list graduation projects with a `category` query parameter, THE API SHALL return only published projects whose category matches the specified value.
3. WHEN an authenticated Recruiter sends a request to list graduation projects with one or more `skillId` query parameters, THE API SHALL return only published projects that have ALL of the specified skills associated via `ProjectSkill` records.
4. WHEN an authenticated Recruiter sends a request to list graduation projects with a `search` query parameter, THE API SHALL return published projects whose title or description contains the search term (case-insensitive).
5. WHEN an authenticated Recruiter sends a request to list graduation projects, THE API SHALL support pagination through `page` (minimum 1) and `pageSize` (minimum 1, maximum 50) query parameters, defaulting to page 1 and pageSize 10.
6. IF an authenticated Recruiter sends a request to list graduation projects with a `page` less than 1 or a `pageSize` outside the range 1–50, THEN THE API SHALL return a 400 Bad Request response identifying the invalid parameter.
7. WHEN an authenticated Recruiter sends a request to retrieve a single graduation project by ID, THE API SHALL return the full project details including student contact information (contact email, WhatsApp number, LinkedIn link).
8. IF an authenticated Recruiter sends a request to retrieve a graduation project with an ID that does not exist, THEN THE API SHALL return a 404 Not Found response.
9. IF an unauthenticated visitor or an authenticated Student sends a request to the graduation project browse endpoint, THEN THE API SHALL return 401 Unauthorized (unauthenticated) or 403 Forbidden (wrong role), respectively.

---

### Requirement 6: Skills Catalog

**User Story:** As a platform user, I want a centralized list of skills/technologies to choose from, so that tagging is consistent across profiles and projects.

#### Acceptance Criteria

1. THE API SHALL expose a public endpoint that returns the full list of `Skill` records (ID and name); if no skills exist, THE API SHALL return a 200 OK response with an empty array.
2. WHEN an authenticated request to create a new skill is made with a name that does not already exist, THE API SHALL create the skill and return 201 Created with the new skill's ID and name.
3. WHEN an authenticated request to create a new skill is made with a name that already exists in the `Skills` table (case-insensitive), THE API SHALL return a 409 Conflict response.
4. IF a request to create or delete a skill is made by a user whose role is not "Admin", THEN THE API SHALL return a 403 Forbidden response.
5. IF a request is made to delete a skill that is currently referenced by one or more `CandidateSkill` or `ProjectSkill` records, THEN THE API SHALL return a 409 Conflict response indicating the skill is in use.
6. IF a request is made to create a skill with a name exceeding 100 characters, THEN THE API SHALL return a 400 Bad Request response with a validation error.

---

### Requirement 7: Threaded Messaging

**User Story:** As a Recruiter, I want to send an initial message to a Student regarding an application or job position, and as a Student, I want to read and reply to those messages, so that both parties can hold structured conversations within the platform.

#### Acceptance Criteria

1. WHEN an authenticated Recruiter sends a request to start a conversation with a Student, providing a non-empty body text (1–2000 characters) and an optional job position title (1–100 characters if provided), THE API SHALL create a `Conversation` record and a parent `Message` record linked to that conversation, and SHALL return a 201 Created response with the conversation ID and message details.
2. IF an authenticated Recruiter sends a request to start a conversation with empty or whitespace-only body text, THEN THE API SHALL return a 400 Bad Request response.
3. IF an authenticated Recruiter sends a request to start a conversation targeting a user ID that does not correspond to a Student, THEN THE API SHALL return a 400 Bad Request response.
4. IF an authenticated Recruiter sends a request to start a conversation with a Student with whom they already have an active conversation, THEN THE API SHALL return a 409 Conflict response.
5. WHEN an authenticated user sends a reply request referencing an existing conversation ID and providing a non-empty body text (1–2000 characters), THE API SHALL create a new `Message` record linked to that conversation and return a 201 Created response with the message details.
6. IF an authenticated user sends a reply request referencing a conversation ID that does not exist, THEN THE API SHALL return a 404 Not Found response.
7. IF an authenticated user sends a reply request to a conversation they are not a participant of, THEN THE API SHALL return a 403 Forbidden response.
8. WHEN an authenticated Student sends a request to list their conversations, THE API SHALL return a list of `Conversation` records sorted by the timestamp of the most recent message descending, each including the recruiter's company name, job position title, most recent message timestamp, and count of unread messages.
9. WHEN an authenticated Recruiter sends a request to list their conversations, THE API SHALL return a list of `Conversation` records sorted by the timestamp of the most recent message descending, each including the student's full name and university field, job position title, most recent message timestamp, and count of unread messages.
10. WHEN an authenticated user sends a request to retrieve a conversation by ID, THE API SHALL return all `Message` records in that conversation in ascending chronological order (oldest first), each including sender role, sender name, body text, sent timestamp, and read status.
11. WHEN an authenticated user fetches a conversation's messages, THE API SHALL mark all messages in that conversation sent by the other participant as read.
12. IF an authenticated user sends a request to retrieve a conversation by ID for a conversation they are not a participant of, THEN THE API SHALL return a 403 Forbidden response.

---

### Requirement 8: Company Profile Management

**User Story:** As a Recruiter, I want to manage my company profile with company name, industry, description, and contact details, so that students can learn about the company reaching out to them.

#### Acceptance Criteria

1. WHEN an authenticated Recruiter sends a request to retrieve their own company profile, THE API SHALL return the `CompanyProfile` data including company name, industry, description, website link, LinkedIn link, WhatsApp number, contact email, and verification status.
2. IF an authenticated Recruiter sends a request to retrieve their company profile and no `CompanyProfile` record exists for their user ID, THEN THE API SHALL return a 404 Not Found response.
3. WHEN an authenticated Recruiter sends a request to update their company profile with valid data (company name 1–150 characters and required; industry required; all other fields optional), THE API SHALL update the `CompanyProfile` record and return the updated profile.
4. IF an authenticated Recruiter sends a company profile update request with a missing or empty company name or industry, THEN THE API SHALL return a 400 Bad Request response identifying the missing required fields.
5. WHEN a Student views a conversation, THE API SHALL include the sender's `CompanyProfile` company name and industry in the conversation response; if the sender has no `CompanyProfile`, those fields SHALL be returned as null.
6. THE API SHALL expose a `VerificationStatus` field on `CompanyProfile` reflecting one of three string values: "Pending", "Verified", or "Rejected".
7. WHEN a new `CompanyProfile` is created during Recruiter registration, THE API SHALL set `VerificationStatus` to "Pending" and `IsVerified` to false.

---

### Requirement 9: Ratings

**User Story:** As a platform user, I want to rate other users after an interaction, so that the community can gauge the quality and trustworthiness of profiles.

#### Acceptance Criteria

1. WHEN an authenticated user sends a rating request with a target user ID and a value between 1 and 5 inclusive, THE API SHALL create a `Rating` record linking the requesting user to the target user and trigger a recalculation of the target's `AverageRating`.
2. IF an authenticated user sends a rating request with a value less than 1 or greater than 5, THEN THE API SHALL return a 400 Bad Request response with a validation error identifying the value field.
3. IF an authenticated user sends a rating request targeting their own user ID, THEN THE API SHALL return a 400 Bad Request response with an error stating self-rating is not permitted.
4. IF an authenticated user sends a rating request targeting a user ID that does not exist, THEN THE API SHALL return a 404 Not Found response.
5. WHEN a `Rating` record is created, THE BLL SHALL recalculate the `AverageRating` on the target's `CandidateProfile` or `CompanyProfile` as the arithmetic mean of all `Rating.Value` entries for that user, rounded to two decimal places, and persist the updated value.
6. WHEN a `Rating` record is deleted, THE BLL SHALL recalculate and persist the `AverageRating` using the same arithmetic mean formula; if no ratings remain, THE BLL SHALL set `AverageRating` to 0.00.
7. IF an authenticated user sends a second rating request targeting the same user they have already rated, THEN THE API SHALL return a 409 Conflict response.
