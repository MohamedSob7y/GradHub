import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import {
    ArrowLeft,
    Save,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getProfile, updateProfile } from "./studentApi";
import type { UpdateProfileDto } from "../shared/types";

interface FormState {
    field: string;
    bio: string;
    experienceYears: string; // keep as string for input; parse on submit
    graduationProjectLink: string;
    portfolioLink: string;
    linkedInLink: string;
    whatsAppNumber: string;
    contactEmail: string;
}

interface FieldErrors {
    field?: string;
    bio?: string;
    experienceYears?: string;
    graduationProjectLink?: string;
    portfolioLink?: string;
    linkedInLink?: string;
    [key: string]: string | undefined;
}

/** Returns true if the string is a valid absolute URL, false otherwise. */
function isValidUrl(value: string): boolean {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

export default function EditProfilePage() {
    const [form, setForm] = useState<FormState>({
        field: "",
        bio: "",
        experienceYears: "0",
        graduationProjectLink: "",
        portfolioLink: "",
        linkedInLink: "",
        whatsAppNumber: "",
        contactEmail: "",
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    // Pre-populate form with current profile values
    useEffect(() => {
        async function fetchProfile() {
            try {
                const profile = await getProfile();
                setForm({
                    field: profile.field ?? "",
                    bio: profile.bio ?? "",
                    experienceYears: String(profile.experienceYears ?? 0),
                    graduationProjectLink: profile.graduationProjectLink ?? "",
                    portfolioLink: profile.portfolioLink ?? "",
                    linkedInLink: profile.linkedInLink ?? "",
                    whatsAppNumber: profile.whatsAppNumber ?? "",
                    contactEmail: profile.contactEmail ?? "",
                });
            } catch {
                setServerError("Failed to load profile data. Please go back and try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm({ ...form, [e.target.id]: e.target.value });
        // Clear field error on change
        if (fieldErrors[e.target.id]) {
            setFieldErrors({ ...fieldErrors, [e.target.id]: undefined });
        }
    }

    /** Client-side validation. Returns true if valid. */
    function validate(): boolean {
        const errors: FieldErrors = {};

        if (form.field && form.field.length > 100) {
            errors.field = "Field must be at most 100 characters.";
        }
        if (form.bio && form.bio.length > 1000) {
            errors.bio = "Bio must be at most 1000 characters.";
        }

        const expYears = Number(form.experienceYears);
        if (form.experienceYears !== "" && (!Number.isInteger(expYears) || expYears < 0)) {
            errors.experienceYears = "Experience years must be a non-negative integer.";
        }

        if (form.graduationProjectLink && !isValidUrl(form.graduationProjectLink)) {
            errors.graduationProjectLink = "Must be a valid URL (e.g. https://…).";
        }
        if (form.portfolioLink && !isValidUrl(form.portfolioLink)) {
            errors.portfolioLink = "Must be a valid URL (e.g. https://…).";
        }
        if (form.linkedInLink && !isValidUrl(form.linkedInLink)) {
            errors.linkedInLink = "Must be a valid URL (e.g. https://…).";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setServerError("");

        if (!validate()) return;

        setSaving(true);
        try {
            // Only send fields that have a value (optional fields omitted if empty)
            const dto: UpdateProfileDto = {};

            if (form.field.trim())                  dto.field = form.field.trim();
            if (form.bio.trim())                     dto.bio = form.bio.trim();
            if (form.experienceYears !== "")         dto.experienceYears = Number(form.experienceYears);
            if (form.graduationProjectLink.trim())   dto.graduationProjectLink = form.graduationProjectLink.trim();
            if (form.portfolioLink.trim())           dto.portfolioLink = form.portfolioLink.trim();
            if (form.linkedInLink.trim())            dto.linkedInLink = form.linkedInLink.trim();
            if (form.whatsAppNumber.trim())          dto.whatsAppNumber = form.whatsAppNumber.trim();
            if (form.contactEmail.trim())            dto.contactEmail = form.contactEmail.trim();

            await updateProfile(dto);
            navigate("/profile");
        } catch (err: unknown) {
            const axiosErr = err as {
                response?: {
                    status?: number;
                    data?: {
                        errors?: Record<string, string[]>;
                        message?: string;
                    };
                };
            };
            if (axiosErr.response?.data?.errors) {
                // Server-side field validation errors
                const serverErrors: FieldErrors = {};
                for (const [f, msgs] of Object.entries(axiosErr.response.data.errors)) {
                    serverErrors[f.charAt(0).toLowerCase() + f.slice(1)] = msgs[0];
                }
                setFieldErrors(serverErrors);
            } else if (axiosErr.response?.data?.message) {
                setServerError(axiosErr.response.data.message);
            } else {
                setServerError("Failed to save changes. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center text-zinc-400">
                    Loading…
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-50 min-h-screen flex flex-col">
            <Navbar />

            <div className="max-w-[720px] mx-auto w-full px-6 py-10 flex flex-col gap-6">

                {/* Page heading */}
                <div className="flex items-center gap-3">
                    <Button
                        asChild
                        variant="ghost"
                        className="rounded-xl text-zinc-500 hover:text-zinc-900 px-2 h-9"
                    >
                        <Link to="/profile">
                            <ArrowLeft className="size-4 mr-1" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="font-extrabold text-2xl text-zinc-950 tracking-tight">
                        Edit Profile
                    </h1>
                </div>

                {serverError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="size-4 flex-shrink-0" />
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Basic info */}
                    <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-zinc-950">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 flex flex-col gap-4">

                            <FormField
                                id="field"
                                label="Academic Field"
                                hint="e.g. Computer Science, Information Technology"
                                error={fieldErrors.field}
                            >
                                <Input
                                    id="field"
                                    type="text"
                                    placeholder="Computer Science"
                                    value={form.field}
                                    onChange={handleChange}
                                    maxLength={100}
                                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                                />
                            </FormField>

                            <FormField
                                id="experienceYears"
                                label="Years of Experience"
                                error={fieldErrors.experienceYears}
                            >
                                <Input
                                    id="experienceYears"
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    value={form.experienceYears}
                                    onChange={handleChange}
                                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100] w-32"
                                />
                            </FormField>

                            <FormField
                                id="bio"
                                label="Bio"
                                hint={`${form.bio.length}/1000 characters`}
                                error={fieldErrors.bio}
                            >
                                <textarea
                                    id="bio"
                                    rows={4}
                                    placeholder="Tell recruiters about yourself, your skills, and what you're looking for…"
                                    value={form.bio}
                                    onChange={handleChange}
                                    maxLength={1000}
                                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#f0b100] resize-none"
                                />
                            </FormField>
                        </CardContent>
                    </Card>

                    {/* Links */}
                    <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-zinc-950">Links</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 flex flex-col gap-4">

                            <FormField
                                id="linkedInLink"
                                label="LinkedIn"
                                hint="Full URL"
                                error={fieldErrors.linkedInLink}
                            >
                                <Input
                                    id="linkedInLink"
                                    type="url"
                                    placeholder="https://linkedin.com/in/yourname"
                                    value={form.linkedInLink}
                                    onChange={handleChange}
                                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                                />
                            </FormField>

                            <FormField
                                id="portfolioLink"
                                label="Portfolio / Website"
                                hint="Full URL"
                                error={fieldErrors.portfolioLink}
                            >
                                <Input
                                    id="portfolioLink"
                                    type="url"
                                    placeholder="https://yourportfolio.dev"
                                    value={form.portfolioLink}
                                    onChange={handleChange}
                                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                                />
                            </FormField>

                            <FormField
                                id="graduationProjectLink"
                                label="Graduation Project Link"
                                hint="Full URL"
                                error={fieldErrors.graduationProjectLink}
                            >
                                <Input
                                    id="graduationProjectLink"
                                    type="url"
                                    placeholder="https://github.com/you/project"
                                    value={form.graduationProjectLink}
                                    onChange={handleChange}
                                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                                />
                            </FormField>
                        </CardContent>
                    </Card>

                    {/* Contact */}
                    <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-zinc-950">Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 flex flex-col gap-4">

                            <FormField id="contactEmail" label="Contact Email" error={fieldErrors.contactEmail}>
                                <Input
                                    id="contactEmail"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.contactEmail}
                                    onChange={handleChange}
                                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                                />
                            </FormField>

                            <FormField id="whatsAppNumber" label="WhatsApp Number" error={fieldErrors.whatsAppNumber}>
                                <Input
                                    id="whatsAppNumber"
                                    type="text"
                                    placeholder="+20 10 XXXX XXXX"
                                    value={form.whatsAppNumber}
                                    onChange={handleChange}
                                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                                />
                            </FormField>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl border-zinc-200 font-medium text-sm text-zinc-700 h-10 px-5 hover:bg-zinc-50"
                            onClick={() => navigate("/profile")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-[#f0b100] text-white font-semibold h-10 px-6 hover:bg-[#d69e00] disabled:opacity-60"
                        >
                            <Save className="size-4 mr-2" />
                            {saving ? "Saving…" : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/** Reusable form field wrapper with label, hint, and error display. */
function FormField({
    id,
    label,
    hint,
    error,
    children,
}: {
    id: string;
    label: string;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
                <Label htmlFor={id} className="text-sm font-semibold text-zinc-800">
                    {label}
                </Label>
                {hint && !error && (
                    <span className="text-xs text-zinc-400">{hint}</span>
                )}
            </div>
            {children}
            {error && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {error}
                </p>
            )}
        </div>
    );
}
