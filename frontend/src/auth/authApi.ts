import axiosInstance from "../shared/api/axiosInstance";
import type { RegisterDto, LoginDto, AuthResultDto, JwtPayload } from "../shared/types";

/**
 * Decode the payload from a JWT without verification.
 * Verification is done server-side; this is only used to read claims client-side.
 */
function decodeJwt(token: string): JwtPayload {
    const base64Payload = token.split(".")[1];
    const json = atob(base64Payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
}

function emitAuthChanged(): void {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:changed"));
    }
}

/** Register a new user. Stores the returned JWT in localStorage. */
export async function register(dto: RegisterDto): Promise<AuthResultDto> {
    const { data } = await axiosInstance.post<AuthResultDto>("/api/auth/register", dto);
    localStorage.setItem("token", data.token);
    localStorage.setItem("expiresAt", data.expiresAt);
    emitAuthChanged();
    return data;
}

/** Log in an existing user. Stores the returned JWT in localStorage. */
export async function login(dto: LoginDto): Promise<AuthResultDto> {
    const { data } = await axiosInstance.post<AuthResultDto>("/api/auth/login", dto);
    localStorage.setItem("token", data.token);
    localStorage.setItem("expiresAt", data.expiresAt);
    emitAuthChanged();
    return data;
}

/** Clear the JWT from localStorage (client-side logout). */
export function logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    emitAuthChanged();
}

/** Returns the decoded JWT payload, or null if no token is stored. */
export function getTokenPayload(): JwtPayload | null {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        return decodeJwt(token);
    } catch {
        return null;
    }
}

/** Returns the current user's role, or null if not authenticated. */
export function getCurrentRole(): "Student" | "Recruiter" | null {
    return getTokenPayload()?.role ?? null;
}

/** Returns true if a non-expired token exists in localStorage. */
export function isAuthenticated(): boolean {
    const payload = getTokenPayload();
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
}
