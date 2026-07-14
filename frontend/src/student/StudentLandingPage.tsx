import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    User,
    FolderOpen,
    GraduationCap,
    Sparkles,
    ArrowRight,
} from "lucide-react";

export default function StudentLandingPage() {
    const navigate = useNavigate();

    const cards = [
        {
            title: "Create / Edit Profile",
            description:
                "Build your professional profile and let recruiters discover you.",
            icon: User,
            path: "/profile",
        },
        {
            title: "Upload Graduation Project",
            description:
                "Showcase your graduation project with GitHub and live demo links.",
            icon: GraduationCap,
            path: "/projects/me/new",
        },
        {
            title: "Manage Skills",
            description:
                "Add your technical skills to improve recruiter matching.",
            icon: Sparkles,
            path: "/profile",
        },
        {
            title: "My Projects",
            description:
                "View and manage all your uploaded graduation projects.",
            icon: FolderOpen,
            path: "/projects/me",
        },
    ];

    return (
        <div className="min-h-screen bg-zinc-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-8 py-16">

                <div className="mb-12">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f0b100]/10 px-4 py-2 text-sm font-semibold text-[#f0b100]">
                        Student Dashboard
                    </span>

                    <h1 className="mt-5 text-5xl font-extrabold text-zinc-900">
                        Welcome Back 👋
                    </h1>

                    <p className="mt-4 max-w-2xl text-zinc-500 text-lg leading-8">
                        Everything you need to build your profile, upload your
                        graduation project and connect with recruiters.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">

                    {cards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <Card
                                key={card.title}
                                className="rounded-3xl border-zinc-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                <CardContent className="p-8">

                                    <div className="w-14 h-14 rounded-2xl bg-[#f0b100]/10 flex items-center justify-center mb-6">
                                        <Icon className="w-7 h-7 text-[#f0b100]" />
                                    </div>

                                    <h2 className="text-2xl font-bold text-zinc-900">
                                        {card.title}
                                    </h2>

                                    <p className="mt-3 text-zinc-500 leading-7">
                                        {card.description}
                                    </p>

                                    <Button
                                        onClick={() => navigate(card.path)}
                                        className="mt-8 bg-[#f0b100] hover:bg-[#d69e00] text-white rounded-xl"
                                    >
                                        Open
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