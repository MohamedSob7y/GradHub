import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  GraduationCap,
} from "lucide-react";
import { browseProjects } from "../projects/projectApi";
import axiosInstance from "../shared/api/axiosInstance";
import type { PagedResult, ProjectSummaryDto, SkillDto } from "../shared/types";

const PAGE_SIZE = 12;

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "AI/ML",
  "Data Science",
  "IoT",
  "Cybersecurity",
  "Cloud",
  "Desktop",
  "Game Development",
  "Other",
];

export default function BrowsePage() {
  const navigate = useNavigate();

  // Filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  // Data state
  const [result, setResult] = useState<PagedResult<ProjectSummaryDto> | null>(null);
  const [allSkills, setAllSkills] = useState<SkillDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  }

  // Fetch skills once on mount
  useEffect(() => {
    axiosInstance
      .get<SkillDto[]>("/api/skills")
      .then(({ data }) => setAllSkills(data))
      .catch(() => {
        // Skills list failing is non-fatal; just leave it empty
      });
  }, []);

  // Fetch projects whenever filters/page change
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await browseProjects({
        page,
        pageSize: PAGE_SIZE,
        category: category || undefined,
        skillId: selectedSkillIds.length > 0 ? selectedSkillIds : undefined,
        search: debouncedSearch || undefined,
      });
      setResult(data);
    } catch {
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, category, selectedSkillIds, debouncedSearch]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  function toggleSkill(skillId: number) {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    setPage(1);
  }

  return (
    <div className="bg-zinc-50 min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-[1100px] mx-auto w-full px-6 py-10 flex flex-col gap-6">
        {/* Page heading */}
        <div>
          <h1 className="font-extrabold text-2xl text-zinc-950 tracking-tight">
            Browse Projects
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Discover graduation projects from talented students.
          </p>
        </div>

        {/* Filters */}
        <Card className="rounded-2xl shadow-sm bg-white border-zinc-200/80">
          <CardContent className="p-4 flex flex-col gap-4">
            {/* Search + Category row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search by title or description…"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 rounded-xl bg-zinc-50 border-zinc-200 h-10 text-sm focus-visible:ring-2 focus-visible:ring-[#f0b100]"
                  aria-label="Search projects"
                />
              </div>

              {/* Category dropdown */}
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 h-10 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#f0b100] sm:w-52"
                aria-label="Filter by category"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills multi-filter */}
            {allSkills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                  Filter by Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map((skill) => {
                    const active = selectedSkillIds.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={`rounded-lg px-3 py-1 text-sm font-medium border transition-colors ${active
                            ? "bg-[#f0b100] text-white border-[#f0b100]"
                            : "bg-zinc-100 text-zinc-700 border-zinc-200 hover:border-[#f0b100] hover:text-[#f0b100]"
                          }`}
                        aria-pressed={active}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results summary */}
        {result && !loading && (
          <p className="text-sm text-zinc-500">
            Showing{" "}
            <span className="font-semibold text-zinc-700">
              {result.items.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-zinc-700">
              {result.totalCount}
            </span>{" "}
            projects
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="size-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-zinc-200/80 h-48 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && result?.items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
            <GraduationCap className="size-12 text-zinc-200" />
            <p className="font-medium text-zinc-500">No projects found.</p>
            <p className="text-sm">Try adjusting your filters or search term.</p>
          </div>
        )}

        {/* Project cards grid */}
        {!loading && result && result.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {result.items.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => navigate(`/browse/${project.id}`)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {result && result.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="rounded-xl border-zinc-200 h-9 px-3"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            <span className="text-sm text-zinc-600 font-medium">
              Page {result.page} of {result.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
              disabled={page >= result.totalPages || loading}
              className="rounded-xl border-zinc-200 h-9 px-3"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onClick,
}: {
  project: ProjectSummaryDto;
  onClick: () => void;
}) {
  return (
    <Card
      className="rounded-2xl shadow-sm bg-white border-zinc-200/80 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`View project: ${project.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-bold text-zinc-950 leading-snug line-clamp-2">
            {project.title}
          </CardTitle>
          <Badge className="flex-shrink-0 rounded-lg bg-[#f0b100]/10 text-[#f0b100] border-0 text-xs font-semibold px-2 py-0.5">
            {project.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col gap-3">
        {/* Student info */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <GraduationCap className="size-4 text-[#f0b100] flex-shrink-0" />
          <span className="truncate font-medium text-zinc-700">{project.studentFullName}</span>
          {project.studentField && (
            <span className="truncate text-zinc-400">· {project.studentField}</span>
          )}
        </div>

        {/* Skills */}
        {project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.skills.slice(0, 5).map((skill) => (
              <span
                key={skill.id}
                className="inline-block rounded-md bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600"
              >
                {skill.name}
              </span>
            ))}
            {project.skills.length > 5 && (
              <span className="inline-block rounded-md bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-xs text-zinc-400">
                +{project.skills.length - 5} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
