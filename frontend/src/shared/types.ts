// ── Auth ──────────────────────────────────────────────────────────────────────

export interface RegisterDto {
    fullName: string;
    email: string;
    password: string;
    role: "Student" | "Recruiter";
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResultDto {
    token: string;
    expiresAt: string; // ISO date string
}

/** Decoded JWT payload claims */
export interface JwtPayload {
    sub: string;       // userId
    email: string;
    role: "Student" | "Recruiter";
    exp: number;
}

// ── Skills ────────────────────────────────────────────────────────────────────

export interface SkillDto {
    id: number;
    name: string;
}

// ── Student Profile ───────────────────────────────────────────────────────────

export interface CandidateProfileDto {
    id: number;
    userId: number;
    fullName: string;
    field: string;
    bio: string | null;
    experienceYears: number;
    graduationProjectLink: string | null;
    portfolioLink: string | null;
    linkedInLink: string | null;
    whatsAppNumber: string | null;
    contactEmail: string | null;
    skills: SkillDto[];
}

export interface UpdateProfileDto {
    field?: string;
    bio?: string;
    experienceYears?: number;
    graduationProjectLink?: string;
    portfolioLink?: string;
    linkedInLink?: string;
    whatsAppNumber?: string;
    contactEmail?: string;
}

// ── Recruiter Profile ─────────────────────────────────────────────────────────

export interface CompanyProfileDto {
    id: number;
    userId: number;
    companyName: string;
    industry: string;
    description: string | null;
    websiteLink: string | null;
    linkedInLink: string | null;
    whatsAppNumber: string | null;
    contactEmail: string | null;
    createdAt: string;
}

export interface UpdateCompanyDto {
    companyName: string;
    industry: string;
    description?: string;
    websiteLink?: string;
    linkedInLink?: string;
    whatsAppNumber?: string;
    contactEmail?: string;
}

// ── Projects ──────────────────────────────────────────────────────────────────

export interface ProjectDto {
    id: number;
    candidateProfileId: number;
    title: string;
    description: string;
    category: string;
    status: "Draft" | "Published";
    gitHubLink: string | null;
    liveDemoLink: string | null;
    createdAt: string;
    updatedAt: string | null;
    skills: SkillDto[];
}

export interface CreateProjectDto {
    title: string;
    description: string;
    category: string;
    gitHubLink?: string;
    liveDemoLink?: string;
    skillIds?: number[];
}

export interface UpdateProjectDto {
    title?: string;
    description?: string;
    category?: string;
    status?: "Draft" | "Published";
    gitHubLink?: string;
    liveDemoLink?: string;
}

export interface ProjectSummaryDto {
    id: number;
    title: string;
    category: string;
    status: string;
    skills: SkillDto[];
    studentFullName: string;
    studentField: string;
}

export interface ProjectDetailDto extends ProjectSummaryDto {
    description: string;
    gitHubLink: string | null;
    liveDemoLink: string | null;
    contactEmail: string | null;
    whatsAppNumber: string | null;
    linkedInLink: string | null;
}

export interface PagedResult<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface BrowseProjectsQuery {
    page?: number;
    pageSize?: number;
    category?: string;
    skillId?: number[];
    search?: string;
}
