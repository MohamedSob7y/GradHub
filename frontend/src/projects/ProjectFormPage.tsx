import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import {
    ArrowLeft,
    Save,
    AlertCircle,
    Plus,
    X,
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
import { createProject, updateProject, addSkill, removeSkill, getMyProjects } from "./projectApi";
import { getAllSkills } from "../student/studentApi";
import type { CreateProjectDto, UpdateProjectDto, SkillDto, ProjectDto } from "../shared/types";

interface FormState {
    title: string;
    description: string;
    category: string;
    gitHubLink: string;
    liveDemoLink: string;
}

interface FieldErrors {
    title?: string;
    description?: string;
    category?: string;
    gitHubLink?: string;
    liveDemoLink?: string;
    [key: string]: string | undefined;
}

/** Returns true if the string is a valid absolute URL. */
function isValidUrl(value: string): boolean {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

export default function ProjectFormPage() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = id !== undefined;
    const projectId = isEditMode ? Number(id) : null;

    const [form, setForm] = useState<FormState>({
        title: "",
        description: "",
        category: "",
        gitHubLink: "",
        liveDemoLink: "",
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);

    // Skill state
    const [allSkills, setAllSkills] = useState<SkillDto[]>([]);
    const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
    const [originalSkillIds, setOriginalSkillIds] = useState<number[]>([]);
    const [selectedToAdd, setSelectedToAdd] = useState<string>("");
    const [skillError, setSkillError] = useState("");

    const navigate = useNavigate();

    // Fetch all available skills on mount
    useEffect(() => {
        getAllSkills().then(setAllSkills).catch(() => {
            // Non-fatal — skills section will just be empty
        });
    }, []);

    // In edit mode, load the existing project
    useEffect(() => {
        if (!isEditMode || projectId === null) return;

        async function fetchProject() {
            try {
                const allProjects = await getMyProjects();
                const project = allProjects.find((p) => p.id === projectId);
                if (!project) {
                    setServerError("Project not found or you don't have permission to edit it.");
                    setLoading(false);
                    return;
                }
                setForm({
                    title: project.title,
                    description: project.description,
                    category: project.category,
                    gitHubLink: project.gitHubLink ?? "",
                    liveDemoLink: project.liveDemoLink ?? "",
                });
                const ids = project.skills.map((s) => s.id);
                setSelectedSkillIds(ids);
                setOriginalSkillIds(ids);
            } catch {
                setServerError("Failed to load project. Please go back and try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
    }, [isEditMode, projectId]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setForm({ ...form, [e.target.id]: e.target.value });
        if (fieldErrors[e.target.id]) {
            setFieldErrors({ ...fieldErrors, [e.target.id]: undefined });
        }
    }

    function handleAddSkill() {
        if (!selectedToAdd) return;
        const id = Number(selectedToAdd);
        if (!selectedSkillIds.includes(id)) {
            setSelectedSkillIds((prev) => [...prev, id]);
        }
        setSelectedToAdd("");
        setSkillError("");
    }

    function handleRemoveSkill(skillId: number) {
        setSelectedSkillIds((prev) => prev.filter((id) => id !== skillId));
        setSkillError("");
    }

    function validate(): boolean {
        const errors: FieldErrors = {};
        const title = form.title.trim();
        const description = form.description.trim();
        const category = form.category.trim();

        if (!title) {
            errors.title = "Title is required.";
        } else if (title.length > 200) {
            errors.title = "Title must be at most 200 characters.";
        }

        if (!description) {
            errors.description = "Description is required.";
        } else if (description.length > 2000) {
            errors.description = "Description must be at most 2000 characters.";
        }

        if (!category) {
            errors.category = "Category is required.";
        }

        if (form.gitHubLink.trim() && !isValidUrl(form.gitHubLink.trim())) {
            errors.gitHubLink = "Must be a valid URL (e.g. https://github.com/…).";
        }
        if (form.liveDemoLink.trim() && !isValidUrl(form.liveDemoLink.trim())) {
            errors.liveDemoLink = "Must be a valid URL (e.g. https://…).";
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
            if (isEditMode && projectId !== null) {
                // Update project fields
                const dto: UpdateProjectDto = {
                    title: form.title.trim(),
                    description: form.description.trim(),
                    category: form.category.trim(),
                };
                if (form.gitHubLink.trim()) dto.gitHubLink = form.gitHubLink.trim();
                if (form.liveDemoLink.trim()) dto.liveDemoLink = form.liveDemoLink.trim();

                await updateProject(projectId, dto);

                // Diff skills: add new ones, remove removed ones
                const toAdd = selectedSkillIds.filter((id) => !originalSkillIds.includes(id));
                const toRemove = originalSkillIds.filter((id) => !selectedSkillIds.includes(id));

                await Promise.all([
                    ...toAdd.map((skillId) => addSkill(projectId, skillId)),
                    ...toRemove.map((skillId) => removeSkill(projectId, skillId)),
                ]);
            } else {
                // Create new project with skills embedded
                const dto: CreateProjectDto = {
                    title: form.title.trim(),
                    description: form.description.trim(),
                    category: form.category.trim(),
                    skillIds: selectedSkillIds.length > 0 ? selectedSkillIds : undefined,
                };
                if (form.gitHubLink.trim()) dto.gitHubLink = form.gitHubLink.trim();
                if (form.liveDemoLink.trim()) dto.liveDemoLink = form.liveDemoLink.trim();

                await createProject(dto);
            }

            navigate("/projects/me");
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
                const serverErrors: FieldErrors = {};
                for (const [f, msgs] of Object.entries(axiosErr.response.data.errors)) {
                    serverErrors[f.charAt(0).toLowerCase() + f.slice(1)] = msgs[0];
                }
                setFieldErrors(serverErrors);
            } else if (axiosErr.response?.data?.message) {
                setServerError(axiosErr.response.data.message);
            } else {
                setServerError("Failed to save project. Please try again.");
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
                    Loading project…
                </div>
            </div>
        );
    }

    const availableSkillsToAdd = allSkills.filter(
        (s) => !selectedSkillIds.includes(s.id)
    );

    return (
        <div className="bg-zinc-50 min-h-screen flex flex-col">
            <Navbar />

            <div className="max-w-[720px] mx-auto w-full px-6 py-10 flex flex-col gap-6">

                {/* Heading */}
                <div className="flex items-center gap-3">
                    <Button
                        asChild
                        variant="ghost"
                        className="rounded-xl text-zinc-500 hover:text-zinc-900 px-2 h-9"
                    >
                        <Link to="/projects/me">
                            <ArrowLeft className="size-4 mr-1" />
                            My Projects
                        </Link>
                    </Button>
                    <h1 className="font-extrabold text-2xl text-zinc-950 tracking-tight">
                        {isEditMode ? "Edit Project" : "New Project"}
                    </h1>
                </div>

                {serverError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="size-4 flex-shrink-0" />
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Core details */}
                    <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-semibold text-zinc-950">
                                Project Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 flex flex-col gap-4">

                            <FormField id="title" label="Title" required error={fieldErrors.title}>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Smart Campus IoT System"
                                    value={form.title}
                                    onChange={handleChange}
                                    maxLength={200}
                                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                                />
                            </FormField>

                            <FormField id="category" label="Category" required error={fieldErrors.category}>
                                <Input
                                    id="category"
                                    type="text"
                                    placeholder="Web, Mobile, AI/ML, IoT, …"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                                />
                            </FormField>

                            <FormField
                                id="description"
                                label="Description"
                                required
                                hint={`${form.description.length}/2000`}
                                error={fieldErrors.description}
                            >
                                <textarea
                                    id="description"
                                    rows={5}
                                    placeholder="Describe your project: what it does, the problem it solves, and the technologies used…"
                                    value={form.description}
                                    onChange={handleChange}
                                    maxLength={2000}
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

                            <FormField id="gitHubLink" label="GitHub Repository" hint="Optional" error={fieldErrors.gitHubLink}>
                                <Input
                                    id="gitHubLink"
                                    type="url"
                                    placeholder="https://github.com/you/project"
                                    value={form.gitHubLink}
                                    onChange={handleChange}
                                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                                />
                            </FormField>

                            <FormField id="liveDemoLink" label="Live Demo" hint="Optional" error={fieldErrors.liveDemoLink}>
                                <Input
                                    id="liveDemoLink"
                                    type="url"
                                    placeholder="https://demo.yourproject.com"
                                    value={form.liveDemoLink}
                                    onChange={handleChange}
                                    className="rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                                />
                            </FormField>
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

                            {/* Selected skills */}
                            <div className="flex flex-wrap gap-2 min-h-[28px]">
                                {selectedSkillIds.length === 0 ? (
                                    <span className="text-zinc-400 text-sm italic">No skills selected yet.</span>
                                ) : (
                                    selectedSkillIds.map((skillId) => {
                                        const skill = allSkills.find((s) => s.id === skillId);
                                        if (!skill) return null;
                                        return (
                                            <span
                                                key={skillId}
                                                className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700"
                                            >
                                                {skill.name}
                                                <button
                                                    type="button"
                                                    aria-label={`Remove ${skill.name}`}
                                                    onClick={() => handleRemoveSkill(skillId)}
                                                    className="ml-1 text-zinc-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </span>
                                        );
                                    })
                                )}
                            </div>

                            {/* Add skill dropdown */}
                            {availableSkillsToAdd.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedToAdd}
                                        onChange={(e) => setSelectedToAdd(e.target.value)}
                                        className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 h-10 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#f0b100]"
                                        aria-label="Select skill to add"
                                    >
                                        <option value="">Select a skill to add…</option>
                                        {availableSkillsToAdd.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Button
                                        type="button"
                                        onClick={handleAddSkill}
                                        disabled={!selectedToAdd}
                                        className="rounded-xl bg-[#f0b100] text-white font-semibold h-10 px-4 hover:bg-[#d69e00] disabled:opacity-60"
                                    >
                                        <Plus className="size-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl border-zinc-200 font-medium text-sm text-zinc-700 h-10 px-5 hover:bg-zinc-50"
                            onClick={() => navigate("/projects/me")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-[#f0b100] text-white font-semibold h-10 px-6 hover:bg-[#d69e00] disabled:opacity-60"
                        >
                            <Save className="size-4 mr-2" />
                            {saving ? "Saving…" : isEditMode ? "Save Changes" : "Create Project"}
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
    required,
    error,
    children,
}: {
    id: string;
    label: string;
    hint?: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
                <Label htmlFor={id} className="text-sm font-semibold text-zinc-800">
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
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
