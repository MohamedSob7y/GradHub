import axiosInstance from "../shared/api/axiosInstance";
import type {
    ProjectDto,
    CreateProjectDto,
    UpdateProjectDto,
    ProjectSummaryDto,
    ProjectDetailDto,
    PagedResult,
    BrowseProjectsQuery,
} from "../shared/types";

/** Create a new graduation project. Returns the created project. */
export async function createProject(dto: CreateProjectDto): Promise<ProjectDto> {
    const { data } = await axiosInstance.post<ProjectDto>("/api/projects", dto);
    return data;
}

/** Fetch all projects belonging to the authenticated student. */
export async function getMyProjects(): Promise<ProjectDto[]> {
    const { data } = await axiosInstance.get<ProjectDto[]>("/api/projects/me");
    return data;
}

/** Update an existing project by ID. Returns the updated project. */
export async function updateProject(id: number, dto: UpdateProjectDto): Promise<ProjectDto> {
    const { data } = await axiosInstance.put<ProjectDto>(`/api/projects/${id}`, dto);
    return data;
}

/** Delete a project by ID. */
export async function deleteProject(id: number): Promise<void> {
    await axiosInstance.delete(`/api/projects/${id}`);
}

/** Add a skill to a project. */
export async function addSkill(projectId: number, skillId: number): Promise<void> {
    await axiosInstance.post(`/api/projects/${projectId}/skills`, { skillId });
}

/** Remove a skill from a project. */
export async function removeSkill(projectId: number, skillId: number): Promise<void> {
    await axiosInstance.delete(`/api/projects/${projectId}/skills/${skillId}`);
}

/**
 * Browse published projects with optional filters (recruiter-facing).
 * skillId is multi-value — serialized as repeated query params.
 */
export async function browseProjects(query: BrowseProjectsQuery): Promise<PagedResult<ProjectSummaryDto>> {
    const params = new URLSearchParams();
    if (query.page !== undefined) params.append("page", String(query.page));
    if (query.pageSize !== undefined) params.append("pageSize", String(query.pageSize));
    if (query.category) params.append("category", query.category);
    if (query.search) params.append("search", query.search);
    if (query.skillId) {
        for (const id of query.skillId) {
            params.append("skillId", String(id));
        }
    }
    const { data } = await axiosInstance.get<PagedResult<ProjectSummaryDto>>(
        `/api/projects?${params.toString()}`
    );
    return data;
}

/** Fetch full project detail including student contact info (recruiter-facing). */
export async function getProjectDetail(id: number): Promise<ProjectDetailDto> {
    const { data } = await axiosInstance.get<ProjectDetailDto>(`/api/projects/${id}`);
    return data;
}
