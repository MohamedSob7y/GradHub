import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import {
    GraduationCap,
    Lock,
    Mail,
    User,
    Building,
    ArrowRight,
    Github,
    Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { register } from "./authApi";
import type { RegisterDto } from "../shared/types";

type RoleOption = "student" | "recruiter";

interface FieldErrors {
    email?: string;
    password?: string;
    name?: string;
    [key: string]: string | undefined;
}

interface FormData {
    name: string;
    email: string;
    password: string;
    companyOrUniversity: string;
}

export default function RegisterPage() {
    const [role, setRole] = useState<RoleOption>("student");
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        companyOrUniversity: "",
    });
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        setLoading(true);

        // Basic client-side validation
        if (formData.password.length < 8) {
            setFieldErrors({ password: "Password must be at least 8 characters." });
            setLoading(false);
            return;
        }

        try {
            const dto: RegisterDto = {
                fullName: formData.name,
                email: formData.email,
                password: formData.password,
                role: role === "student" ? "Student" : "Recruiter",
            };
            await register(dto);

            // On success redirect to /login as per spec
            navigate("/login");
        } catch (err: unknown) {
            const axiosErr = err as {
                response?: {
                    status?: number;
                    data?: {
                        errors?: Record<string, string[]>;
                        error?: string;
                    };
                };
            };
            if (axiosErr.response?.status === 409) {
                setError("This email is already registered. Try logging in.");
            } else if (axiosErr.response?.data?.errors) {
                // ValidationException field errors from the BLL
                const serverErrors: FieldErrors = {};
                for (const [field, msgs] of Object.entries(axiosErr.response.data.errors)) {
                    serverErrors[field.toLowerCase()] = msgs[0];
                }
                setFieldErrors(serverErrors);
            } else if (axiosErr.response?.data?.error) {
                setError(axiosErr.response.data.error);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white text-zinc-950 min-h-screen flex flex-col w-screen max-w-full overflow-x-hidden">
            <Navbar />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 w-full max-w-[1440px] mx-auto">

                {/* Left Column: Visual Backdrop */}
                <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-zinc-950 text-white">
                    <div className="absolute inset-0 z-0 opacity-45">
                        <img
                            alt="Diverse university group collaborating"
                            className="object-cover w-full h-full filter grayscale contrast-125"
                            src="https://images.unsplash.com/photo-1758270705172-07b53627dfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
                    </div>

                    <div className="relative z-10 flex items-center gap-2">
                        <div className="rounded-lg bg-[#f0b100] flex justify-center items-center w-8 h-8 shadow-md">
                            <GraduationCap className="size-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-xl tracking-tight">GradHub</span>
                    </div>

                    <div className="relative z-10 max-w-[460px] flex flex-col gap-4">
                        <blockquote className="text-xl font-medium leading-relaxed text-zinc-100">
                            &ldquo;Join our unified ecosystem engineered exclusively to launch high-performance tech careers and build meaningful institutional matches.&rdquo;
                        </blockquote>
                        <div>
                            <p className="font-semibold text-[#f0b100] text-sm">GradHub Network</p>
                            <p className="text-zinc-400 text-xs">Empowering 5,000+ Future Developers</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Registration Form */}
                <div className="flex items-center justify-center p-6 md:p-12 bg-zinc-50/50">
                    <Card className="w-full max-w-[460px] shadow-xl rounded-2xl bg-white border-zinc-200/80 p-2 md:p-4">
                        <CardHeader className="space-y-2 text-center">
                            <div className="lg:hidden flex justify-center mb-2">
                                <div className="rounded-xl bg-[#f0b100] flex justify-center items-center w-10 h-10 shadow-md">
                                    <GraduationCap className="size-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="font-extrabold text-2xl tracking-tight text-zinc-950">
                                Create Your Account
                            </CardTitle>
                            <CardDescription className="text-zinc-500 text-sm">
                                Get started today — free to set up and customize
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {error && (
                                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Role Selector */}
                            <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-xl mb-6 border border-zinc-200/40">
                                <button
                                    type="button"
                                    onClick={() => setRole("student")}
                                    className={`py-2 text-sm font-semibold rounded-lg transition-all ${role === "student"
                                        ? "bg-white text-zinc-950 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-900"
                                        }`}
                                >
                                    As Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("recruiter")}
                                    className={`py-2 text-sm font-semibold rounded-lg transition-all ${role === "recruiter"
                                        ? "bg-white text-zinc-950 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-900"
                                        }`}
                                >
                                    As Recruiter
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-semibold text-zinc-800">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Alex Mercer"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="rounded-xl bg-zinc-50 border-zinc-200 pl-10 h-11 focus-visible:ring-2 focus-visible:ring-[#f0b100] transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-zinc-800">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder={role === "student" ? "you@university.edu" : "talent@company.com"}
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="rounded-xl bg-zinc-50 border-zinc-200 pl-10 h-11 focus-visible:ring-2 focus-visible:ring-[#f0b100] transition-all text-sm"
                                        />
                                        {fieldErrors.email && (
                                            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Company / University (contextual) */}
                                <div className="space-y-2">
                                    <Label htmlFor="companyOrUniversity" className="text-sm font-semibold text-zinc-800">
                                        {role === "student" ? "University / Institute" : "Company Name"}
                                    </Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                        <Input
                                            id="companyOrUniversity"
                                            type="text"
                                            placeholder={role === "student" ? "Cairo University" : "Stark Industries"}
                                            value={formData.companyOrUniversity}
                                            onChange={handleChange}
                                            required
                                            className="rounded-xl bg-zinc-50 border-zinc-200 pl-10 h-11 focus-visible:ring-2 focus-visible:ring-[#f0b100] transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold text-zinc-800">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={8}
                                            className="rounded-xl bg-zinc-50 border-zinc-200 pl-10 h-11 focus-visible:ring-2 focus-visible:ring-[#f0b100] transition-all text-sm"
                                        />
                                        {fieldErrors.password && (
                                            <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full shadow-md font-semibold rounded-xl bg-[#f0b100] text-white h-11 transition-all hover:bg-[#d69e00] cursor-pointer mt-4 disabled:opacity-60"
                                >
                                    {loading
                                        ? "Creating account…"
                                        : `Create ${role === "student" ? "Student" : "Recruiter"} Profile`}
                                    {!loading && <ArrowRight className="size-4 ml-2" />}
                                </Button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full border-zinc-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-zinc-400 font-medium">Or register with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    className="rounded-xl border-zinc-200 font-medium text-sm text-zinc-700 h-10 hover:bg-zinc-50"
                                    type="button"
                                    disabled
                                >
                                    <Globe className="size-4 mr-2 text-zinc-600" />
                                    Google
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-xl border-zinc-200 font-medium text-sm text-zinc-700 h-10 hover:bg-zinc-50"
                                    type="button"
                                    disabled
                                >
                                    <Github className="size-4 mr-2 text-zinc-950" />
                                    GitHub
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter className="justify-center pt-2 pb-4">
                            <p className="text-zinc-500 text-sm">
                                Already have an account?{" "}
                                <Link to="/login" className="font-semibold text-[#f0b100] hover:underline">
                                    Log in
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
