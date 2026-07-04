import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import {
    GraduationCap,
    Briefcase,
    Mail,
    Phone,
    Linkedin,
    Globe,
    Link2,
    Pencil,
    X,
    Plus,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getProfile, removeSkill, addSkill, getAllSkills } from "./studentApi";
import type { CandidateProfileDto, SkillDto } from "../shared/types";

export default function ProfilePage() {
    const [profile, setProfile] = useState<CandidateProfileDto | null>(null);
    const [allSkills, setAllSkills] = useState<SkillDto[]>([]);
    const [selectedSkillId, setSelectedSkillId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [skillError, setSkillError] = useState("");
    const [skillLoading, setSkillLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const [profileData, skillsData] = await Promise.all([
                    getProfile(),
                    getAllSkills(),
                ]);
                setProfile(profileData);
                setAllSkills(skillsData);
            } catch {
                setError("Failed to load profile. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    /** Skills not yet on the profile — used to populate the add dropdown. */
    const availableSkills = allSkills.filter(
        (s) => !profile?.skills.some((ps) => ps.id === s.id)
    );

    async function handleRemoveSkill(skillId: number) {
        if (!profile) return;
        setSkillError("");
        try {
            await removeSkill(skillId);
            setProfile({
                ...profile,
                skills: profile.skills.filter((s) => s.id !== skillId),
            });
        } catch {
            setSkillError("Failed to remove skill. Please try again.");
        }
    }

    async function handleAddSkill() {
        if (!profile || !selectedSkillId) return;
        setSkillError("");
        setSkillLoading(true);
        try {
            const id = Number(selectedSkillId);
            await addSkill(id);
            const skill = allSkills.find((s) => s.id === id)!;
            setProfile({ ...profile, skills: [...profile.skills, skill] });
            setSelectedSkillId("");
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number } };
            if (axiosErr.response?.status === 409) {
                setSkillError("Skill is already on your profile.");
            } else {
                setSkillError("Failed to add skill. Please try again.");
            }
        } finally {
            setSkillLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center text-zinc-400">
                    Loading profile…
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="bg-white min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="size-5" />
                        <span>{error || "Profile not found."}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-50 min-h-screen flex flex-col">
            <Navbar />

            <div className="max-w-[860px] mx-auto w-full px-6 py-10 flex flex-col gap-6">

                {/* Header card */}
                <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
                    <CardContent className="p-6 flex flex-col sm:flex-row sm:items-start gap-6">
                        {/* Avatar placeholder */}
                        <div className="flex-shrink-0 rounded-full bg-[#f0b100]/15 flex items-center justify-center w-16 h-16 text-[#f0b100] font-bold text-2xl select-none">
                            {profile.fullName.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <h1 className="font-extrabold text-2xl text-zinc-950 tracking-tight">
                                    {profile.fullName}
                                </h1>
                                <Button
                                    asChild
                                    className="rounded-xl bg-[#f0b100] text-white font-semibold h-9 px-4 hover:bg-[#d69e00] self-start sm:self-auto"
                                >
                                    <Link to="/profile/edit">
                                        <Pencil className="size-4 mr-2" />
                                        Edit Profile
                                    </Link>
                                </Button>
                            </div>

                            {profile.field && (
                                <p className="text-zinc-500 text-sm font-medium">{profile.field}</p>
                            )}

                            <div className="flex items-center gap-2 mt-1 text-zinc-500 text-sm">
                                <Briefcase className="size-4 text-[#f0b100]" />
                                <span>
                                    {profile.experienceYears} year{profile.experienceYears !== 1 ? "s" : ""} of experience
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bio */}
                {profile.bio && (
                    <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-zinc-950">About</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Contact & Links */}
                <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-zinc-950">Contact &amp; Links</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 flex flex-col gap-3">
                        {profile.contactEmail && (
                            <ContactRow icon={<Mail className="size-4 text-[#f0b100]" />} label="Email">
                                <a href={`mailto:${profile.contactEmail}`} className="text-zinc-700 hover:underline text-sm">
                                    {profile.contactEmail}
                                </a>
                            </ContactRow>
                        )}
                        {profile.whatsAppNumber && (
                            <ContactRow icon={<Phone className="size-4 text-[#f0b100]" />} label="WhatsApp">
                                <span className="text-zinc-700 text-sm">{profile.whatsAppNumber}</span>
                            </ContactRow>
                        )}
                        {profile.linkedInLink && (
                            <ContactRow icon={<Linkedin className="size-4 text-[#f0b100]" />} label="LinkedIn">
                                <a href={profile.linkedInLink} target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:underline text-sm truncate">
                                    {profile.linkedInLink}
                                </a>
                            </ContactRow>
                        )}
                        {profile.portfolioLink && (
                            <ContactRow icon={<Globe className="size-4 text-[#f0b100]" />} label="Portfolio">
                                <a href={profile.portfolioLink} target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:underline text-sm truncate">
                                    {profile.portfolioLink}
                                </a>
                            </ContactRow>
                        )}
                        {profile.graduationProjectLink && (
                            <ContactRow icon={<Link2 className="size-4 text-[#f0b100]" />} label="Graduation Project">
                                <a href={profile.graduationProjectLink} target="_blank" rel="noopener noreferrer" className="text-zinc-700 hover:underline text-sm truncate">
                                    {profile.graduationProjectLink}
                                </a>
                            </ContactRow>
                        )}
                        {!profile.contactEmail && !profile.whatsAppNumber && !profile.linkedInLink &&
                            !profile.portfolioLink && !profile.graduationProjectLink && (
                                <p className="text-zinc-400 text-sm italic">No contact info added yet.</p>
                            )}
                    </CardContent>
                </Card>

                {/* Skills */}
                <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-zinc-950">Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 flex flex-col gap-4">
                        {skillError && (
                            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 flex items-center gap-2">
                                <AlertCircle className="size-4 flex-shrink-0" />
                                {skillError}
                            </div>
                        )}

                        {/* Current skills with remove buttons */}
                        <div className="flex flex-wrap gap-2 min-h-[28px]">
                            {profile.skills.length === 0 ? (
                                <span className="text-zinc-400 text-sm italic">No skills added yet.</span>
                            ) : (
                                profile.skills.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700"
                                    >
                                        {skill.name}
                                        <button
                                            type="button"
                                            aria-label={`Remove ${skill.name}`}
                                            onClick={() => handleRemoveSkill(skill.id)}
                                            className="ml-1 text-zinc-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </span>
                                ))
                            )}
                        </div>

                        {/* Add skill dropdown */}
                        {availableSkills.length > 0 && (
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedSkillId}
                                    onChange={(e) => setSelectedSkillId(e.target.value)}
                                    className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 h-10 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#f0b100]"
                                    aria-label="Select skill to add"
                                >
                                    <option value="">Select a skill to add…</option>
                                    {availableSkills.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                                <Button
                                    type="button"
                                    onClick={handleAddSkill}
                                    disabled={!selectedSkillId || skillLoading}
                                    className="rounded-xl bg-[#f0b100] text-white font-semibold h-10 px-4 hover:bg-[#d69e00] disabled:opacity-60"
                                >
                                    <Plus className="size-4 mr-1" />
                                    Add
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* My Projects link */}
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        className="rounded-xl border-zinc-200 font-medium text-sm text-zinc-700 h-10 px-5 hover:bg-zinc-50"
                        onClick={() => navigate("/projects/me")}
                    >
                        <GraduationCap className="size-4 mr-2 text-[#f0b100]" />
                        My Projects
                    </Button>
                </div>
            </div>
        </div>
    );
}

/** Small helper for contact/link rows. */
function ContactRow({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex-shrink-0">{icon}</span>
            <span className="text-zinc-400 text-xs w-28 flex-shrink-0">{label}</span>
            <span className="flex-1 min-w-0">{children}</span>
        </div>
    );
}
