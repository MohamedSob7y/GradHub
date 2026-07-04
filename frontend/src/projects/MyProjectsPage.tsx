import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import {
    Plus,
    Pencil,
    Trash2,
    Github,
    ExternalLink,
    AlertCircle,
    GraduationCap,
    Eye,
    EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getMyProjects, updateProject, deleteProject } from "./projectApi";
import type { ProjectDto } from "../shared/types";

export default function MyProjectsPage() {
    const [projects, setProjects] = useState<ProjectDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [togglingId, setTogglingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const navigate = useNavigate();

    async function fetchProjects() {
        try {
            const data = await getMyProjects();
            setProjects(data);
        } catch {
            setError("Failed to load projects. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    async function handleTogglePublish(project: ProjectDto) {
        setTogglingId(project.id);
        try {
            const newStatus = project.status === "Published" ? "Draft" : "Published";
            const updated = await updateProject(project.id, { status: newStatus });
            setProjects((prev: ProjectDto[]) =>
                prev.map((p: ProjectDto) => (p.id === updated.id ? updated : p))
            );
        } catch {
            setError("Failed to update project status. Please try again.");
        } finally {
            setTogglingId(null);
        }
    }

    async function handleDelete(project: ProjectDto) {
        if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
        setDeletingId(project.id);
        try {
            await deleteProject(project.id);
            setProjects((prev: ProjectDto[]) => prev.filter((p: ProjectDto) => p.id !== project.id));
        } catch {
            setError("Failed to delete project. Please try again.");
        } finally {
            setDeletingId(null);
        }
    }

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center text-zinc-400">
                    Loading projects…
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-50 min-h-screen flex flex-col">
            <Navbar />

            <div className="max-w-[860px] mx-auto w-full px-6 py-10 flex flex-col gap-6">

                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            variant="ghost"
                            className="rounded-xl text-zinc-500 hover:text-zinc-900 px-2 h-9"
                        >
                            <Link to="/profile">
                                <GraduationCap className="size-4 mr-1" />
                                Profile
                            </Link>
                        </Button>
                        <h1 className="font-extrabold text-2xl text-zinc-950 tracking-tight">
                            My Projects
                        </h1>
                    </div>
                    <Button
                        onClick={() => navigate("/projects/me/new")}
                        className="rounded-xl bg-[#f0b100] text-white font-semibold h-10 px-5 hover:bg-[#d69e00]"
                    >
                        <Plus className="size-4 mr-2" />
                        New Project
                    </Button>
                </div>

                {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="size-4 flex-shrink-0" />
                        {error}
                        <button
                            type="button"
                            className="ml-auto text-red-400 hover:text-red-600 text-xs underline"
                            onClick={() => setError("")}
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {projects.length === 0 ? (
                    <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
                        <CardContent className="p-10 flex flex-col items-center gap-4 text-center">
                            <GraduationCap className="size-12 text-zinc-200" />
                            <p className="text-zinc-500 text-sm">
                                You haven't added any projects yet.
                            </p>
                            <Button
                                onClick={() => navigate("/projects/me/new")}
                                className="rounded-xl bg-[#f0b100] text-white font-semibold h-10 px-5 hover:bg-[#d69e00]"
                            >
                                <Plus className="size-4 mr-2" />
                                Add Your First Project
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-4">
                        {projects.map((project: ProjectDto) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                isToggling={togglingId === project.id}
                                isDeleting={deletingId === project.id}
                                onTogglePublish={() => handleTogglePublish(project)}
                                onEdit={() => navigate(`/projects/${project.id}/edit`)}
                                onDelete={() => handleDelete(project)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

interface ProjectCardProps {
    project: ProjectDto;
    isToggling: boolean;
    isDeleting: boolean;
    onTogglePublish: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

function ProjectCard({
    project,
    isToggling,
    isDeleting,
    onTogglePublish,
    onEdit,
    onDelete,
}: ProjectCardProps) {
    const isPublished = project.status === "Published";

    return (
        <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1 min-w-0">
                        <CardTitle className="text-base font-bold text-zinc-950 leading-snug truncate">
                            {project.title}
                        </CardTitle>
                        <span className="text-xs text-zinc-400 font-medium">{project.category}</span>
                    </div>
                    <Badge
                        className={`flex-shrink-0 rounded-lg font-medium text-xs px-2 py-0.5 ${isPublished
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200"
                            }`}
                    >
                        {isPublished ? "Published" : "Draft"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-0 flex flex-col gap-3">
                <p className="text-zinc-600 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                </p>

                {/* Skills */}
                {project.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {project.skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="inline-flex rounded-lg bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-700"
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Links */}
                {(project.gitHubLink || project.liveDemoLink) && (
                    <div className="flex items-center gap-4">
                        {project.gitHubLink && (
                            <a
                                href={project.gitHubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
                            >
                                <Github className="size-3.5" />
                                GitHub
                            </a>
                        )}
                        {project.liveDemoLink && (
                            <a
                                href={project.liveDemoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
                            >
                                <ExternalLink className="size-3.5" />
                                Live Demo
                            </a>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onTogglePublish}
                        disabled={isToggling}
                        className="rounded-xl border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50 h-8 px-3 disabled:opacity-60"
                    >
                        {isToggling ? (
                            "Updating…"
                        ) : isPublished ? (
                            <>
                                <EyeOff className="size-3.5 mr-1.5" />
                                Unpublish
                            </>
                        ) : (
                            <>
                                <Eye className="size-3.5 mr-1.5" />
                                Publish
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onEdit}
                        className="rounded-xl border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50 h-8 px-3"
                    >
                        <Pencil className="size-3.5 mr-1.5" />
                        Edit
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="rounded-xl border-red-100 text-xs font-medium text-red-500 hover:bg-red-50 hover:border-red-200 h-8 px-3 disabled:opacity-60 ml-auto"
                    >
                        {isDeleting ? (
                            "Deleting…"
                        ) : (
                            <>
                                <Trash2 className="size-3.5 mr-1.5" />
                                Delete
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
