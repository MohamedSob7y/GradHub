import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/ui/navbar";

import {
    GraduationCap,
    Lock,
    Mail,
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
import { login } from "./authApi";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login({ email, password });
            navigate("/", { replace: true });
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Invalid email or password.");
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
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

            {/* Main Container */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 w-full max-w-[1440px] mx-auto">

                {/* Left Column: Visual & Branding */}
                <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-zinc-950 text-white">
                    <div className="absolute inset-0 z-0 opacity-40">
                        <img
                            alt="Students working on laptops"
                            className="object-cover w-full h-full "
                            src="https://images.unsplash.com/photo-1758270705172-07b53627dfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                    </div>

                    <div className="relative z-10 flex items-center gap-2">
                        <div className="rounded-lg bg-[#f0b100] flex justify-center items-center w-8 h-8 shadow-md">
                            <GraduationCap className="size-4 text-white" />
                        </div>
                        <span className="font-bold text-white text-xl tracking-tight">GradHub</span>
                    </div>

                    <div className="relative z-10 max-w-[460px] flex flex-col gap-4">
                        <blockquote className="text-xl font-medium leading-relaxed text-zinc-100">
                            &ldquo;GradHub completely changed how our company recruits technical talent. Finding verified graduation projects saved our engineering team dozens of interview hours.&rdquo;
                        </blockquote>
                        <div>
                            <p className="font-semibold text-[#f0b100] text-sm">Tech Hiring Lead</p>
                            <p className="text-zinc-400 text-xs">Global Software Solutions</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Login Form */}
                <div className="flex items-center justify-center p-6 md:p-12 bg-zinc-50/50">
                    <Card className="w-full max-w-[440px] shadow-xl rounded-2xl bg-white border-zinc-200/80 p-2 md:p-4">
                        <CardHeader className="space-y-2 text-center">
                            <div className="lg:hidden flex justify-center mb-2">
                                <div className="rounded-xl bg-[#f0b100] flex justify-center items-center w-10 h-10 shadow-md">
                                    <GraduationCap className="size-5 text-white" />
                                </div>
                            </div>
                            <CardTitle className="font-extrabold text-2xl tracking-tight text-zinc-950">
                                Welcome Back
                            </CardTitle>
                            <CardDescription className="text-zinc-500 text-sm">
                                Enter your credentials to access your GradHub ecosystem
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {error && (
                                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold text-zinc-800">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@university.edu"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="rounded-xl bg-zinc-50 border-zinc-200 pl-10 h-11 focus-visible:ring-2 focus-visible:ring-[#f0b100] transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password" className="text-sm font-semibold text-zinc-800">
                                            Password
                                        </Label>
                                        <a href="#" className="text-xs font-medium text-[#f0b100] hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="rounded-xl bg-zinc-50 border-zinc-200 pl-10 h-11 focus-visible:ring-2 focus-visible:ring-[#f0b100] transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full shadow-md font-semibold rounded-xl bg-[#f0b100] text-white h-11 transition-all hover:bg-[#d69e00] cursor-pointer mt-2 disabled:opacity-60"
                                >
                                    {loading ? "Signing in…" : "Sign In"}
                                    {!loading && <ArrowRight className="size-4 ml-2" />}
                                </Button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator className="w-full border-zinc-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-zinc-400 font-medium">Or continue with</span>
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
                                Don&apos;t have an account?{" "}
                                <Link to="/signup" className="font-semibold text-[#f0b100] hover:underline">
                                    Sign up free
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
