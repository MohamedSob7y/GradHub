import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";
import { getProjectDetail } from "../projects/projectApi";
import type { ProjectDetailDto } from "../shared/types";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    getProjectDetail(numericId)
      .then((data) => setProject(data))
      .catch((err: unknown) => {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr.response?.status === 404) {
          setNotFound(true);
        } else {
          setError("Failed to load project. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

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

  if (notFound) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-zinc-500">
          <GraduationCap className="size-14 text-zinc-200" />
          <p className="font-semibold text-zinc-700 text-lg">Project not found.</p>
          <Button
            variant="outline"
            className="rounded-xl border-zinc-200"
            onClick={() => navigate("/browse")}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="size-5" />
            <span>{error || "Something went wrong."}</span>
          </div>
        </div>
      </div>
    );
  }

  const hasContact = project.contactEmail || project.whatsAppNumber || project.linkedInLink;

  return (
    <div className="bg-zinc-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-[800px] mx-auto w-full px-6 py-10 flex flex-col gap-6">
        {/* Back button */}
        <div>
          <Button
            variant="ghost"
            className="rounded-xl text-zinc-500 hover:text-zinc-900 px-2 h-9"
            onClick={() => navigate("/browse")}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back to Browse
          </Button>
        </div>

        {/* Header */}
        <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h1 className="font-extrabold text-2xl text-zinc-950 tracking-tight leading-snug">
                  {project.title}
                </h1>
                <span className="inline-block w-fit rounded-lg bg-[#f0b100]/10 text-[#f0b100] text-xs font-semibold px-3 py-1">
                  {project.category}
                </span>
              </div>

              {/* Links */}
              <div className="flex gap-2 flex-wrap">
                {project.gitHubLink && (
                  <a
                    href={project.gitHubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 h-9 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <Github className="size-4" />
                    GitHub
                  </a>
                )}
                {project.liveDemoLink && (
                  <a
                    href={project.liveDemoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 h-9 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <ExternalLink className="size-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>

            {/* Skills */}
            {project.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-block rounded-md bg-zinc-100 border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-zinc-950">
              Description
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </CardContent>
        </Card>

        {/* Student info */}
        <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-zinc-950">
              Student
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 rounded-full bg-[#f0b100]/15 flex items-center justify-center w-10 h-10 text-[#f0b100] font-bold text-lg select-none">
                {project.studentFullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-zinc-900 text-sm">
                  {project.studentFullName}
                </p>
                {project.studentField && (
                  <p className="text-zinc-500 text-xs">{project.studentField}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact info */}
        {hasContact && (
          <Card className="rounded-2xl shadow-md bg-white border-zinc-200/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-zinc-950">
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col gap-3">
              {project.contactEmail && (
                <ContactRow
                  icon={<Mail className="size-4 text-[#f0b100]" />}
                  label="Email"
                >
                  <a
                    href={`mailto:${project.contactEmail}`}
                    className="text-zinc-700 hover:underline text-sm"
                  >
                    {project.contactEmail}
                  </a>
                </ContactRow>
              )}
              {project.whatsAppNumber && (
                <ContactRow
                  icon={<Phone className="size-4 text-[#f0b100]" />}
                  label="WhatsApp"
                >
                  <span className="text-zinc-700 text-sm">
                    {project.whatsAppNumber}
                  </span>
                </ContactRow>
              )}
              {project.linkedInLink && (
                <ContactRow
                  icon={<Linkedin className="size-4 text-[#f0b100]" />}
                  label="LinkedIn"
                >
                  <a
                    href={project.linkedInLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-700 hover:underline text-sm truncate"
                  >
                    {project.linkedInLink}
                  </a>
                </ContactRow>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

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
      <span className="text-zinc-400 text-xs w-24 flex-shrink-0">{label}</span>
      <span className="flex-1 min-w-0">{children}</span>
    </div>
  );
}
