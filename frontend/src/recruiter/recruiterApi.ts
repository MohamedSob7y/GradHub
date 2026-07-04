import axiosInstance from "../shared/api/axiosInstance";
import type { CompanyProfileDto, UpdateCompanyDto } from "../shared/types";

/** Fetch the authenticated recruiter's company profile. */
export async function getProfile(): Promise<CompanyProfileDto> {
    const { data } = await axiosInstance.get<CompanyProfileDto>("/api/recruiters/me");
    return data;
}

/** Update the authenticated recruiter's company profile. */
export async function updateProfile(dto: UpdateCompanyDto): Promise<CompanyProfileDto> {
    const { data } = await axiosInstance.put<CompanyProfileDto>("/api/recruiters/me", dto);
    return data;
}
