import axiosInstance from "../shared/api/axiosInstance";
import type { CandidateProfileDto, UpdateProfileDto, SkillDto } from "../shared/types";

/** Fetch the authenticated student's own profile including skills. */
export async function getProfile(): Promise<CandidateProfileDto> {
    const { data } = await axiosInstance.get<CandidateProfileDto>("/api/students/me");
    return data;
}

/** Update the authenticated student's profile fields. Returns the updated profile. */
export async function updateProfile(dto: UpdateProfileDto): Promise<CandidateProfileDto> {
    const { data } = await axiosInstance.put<CandidateProfileDto>("/api/students/me", dto);
    return data;
}

/** Add a skill to the authenticated student's profile by skill ID. */
export async function addSkill(skillId: number): Promise<void> {
    await axiosInstance.post("/api/students/me/skills", { skillId });
}

/** Remove a skill from the authenticated student's profile by skill ID. */
export async function removeSkill(skillId: number): Promise<void> {
    await axiosInstance.delete(`/api/students/me/skills/${skillId}`);
}

/** Fetch the full list of available skills. */
export async function getAllSkills(): Promise<SkillDto[]> {
    const { data } = await axiosInstance.get<SkillDto[]>("/api/skills");
    return data;
}
