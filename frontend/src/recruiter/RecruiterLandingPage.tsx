import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import {
  FolderOpen,
  Search,
  Filter,
  Users,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  {
    title: "Browse Graduation Projects",
    description:
      "Explore published graduation projects from talented students.",
    icon: FolderOpen,
    path: "/browse",
    button: "Browse",
  },
  {
    title: "Search by Skills",
    description:
      "Find students based on technologies like React, .NET, Flutter, AI and more.",
    icon: Search,
    path: "/browse",
    button: "Search",
  },
  {
    title: "Filter by Category",
    description:
      "Browse projects by category such as Web, Mobile, AI, IoT and Cyber Security.",
    icon: Filter,
    path: "/browse",
    button: "Filter",
  },
  {
    title: "View Student Profiles",
    description:
      "Discover student profiles, skills, portfolios and graduation projects.",
    icon: Users,
    path: "/browse",
    button: "View",
  },
  {
    title: "Contact Students",
    description:
      "Connect directly with students and discuss internship or job opportunities.",
    icon: MessageCircle,
    path: "/browse",
    button: "Contact",
  },
];

export default function RecruiterLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-zinc-900">
            Welcome Back 👋
          </h1>

          <p className="mt-4 text-zinc-500 max-w-2xl mx-auto text-lg">
            Discover talented students, browse graduation projects and connect
            with your future team through GradHub.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {actions.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="rounded-2xl border-zinc-200 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <CardContent className="p-6 flex flex-col h-full">

                  <div className="w-14 h-14 rounded-2xl bg-[#f0b100]/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-[#f0b100]" />
                  </div>

                  <h2 className="text-xl font-bold text-zinc-900">
                    {item.title}
                  </h2>

                  <p className="text-zinc-500 mt-3 flex-1">
                    {item.description}
                  </p>

                  <Button
                    onClick={() => navigate(item.path)}
                    className="mt-6 bg-[#f0b100] hover:bg-[#d69e00] rounded-xl"
                  >
                    {item.button}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>

                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}