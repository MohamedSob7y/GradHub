import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Home, Users, Briefcase, FolderOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
    { name: "Home", icon: Home },
    { name: "For Students", icon: Users },
    { name: "For Recruiters", icon: Briefcase },
    { name: "Projects", icon: FolderOpen },
    { name: "About", icon: Info },
];

export default function Navbar() {
    const [activeTab, setActiveTab] = useState("Home");
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const navigate = useNavigate();

    return (
        <nav className="sticky z-50 bg-white border-b border-zinc-200 top-0 w-full">
            <div className="max-w-[1140px] flex mx-auto px-8 py-4 justify-between items-center">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-[#f0b100] flex justify-center items-center w-9 h-9">
                        <GraduationCap className="size-5 text-white" />
                    </div>
                    <span className="font-bold text-zinc-950 text-xl tracking-tight">GradHub</span>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.name;
                        const isHovered = hoveredTab === item.name;

                        return (
                            <button
                                key={item.name}
                                onClick={() => setActiveTab(item.name)}
                                onMouseEnter={() => setHoveredTab(item.name)}
                                onMouseLeave={() => setHoveredTab(null)}
                                className={`flex pb-1 items-center gap-2 border-b-2 transition-all duration-200 cursor-pointer text-sm font-medium
                                    ${isActive
                                        ? "border-[#f0b100] text-zinc-950"
                                        : isHovered
                                            ? "border-[#f0b100]/50 text-zinc-950"
                                            : "border-transparent text-[#71717b]"
                                    }`}
                            >
                                <Icon className="size-4" />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/login")}
                        className="font-medium text-sm cursor-pointer transition-all hover:bg-zinc-100 hover:text-[#f0b100]"
                    >
                        Sign In
                    </Button>
                    <Button
                        onClick={() => navigate("/signup")}
                        className="font-medium rounded-lg bg-[#f0b100] text-white text-sm cursor-pointer transition-all hover:scale-105 hover:bg-[#d69e00]"
                    >
                        Get Started
                    </Button>
                </div>
            </div>
        </nav>
    );
}