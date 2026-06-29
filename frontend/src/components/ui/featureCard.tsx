import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card"; // Check this path!

interface FeatureCardProps {
    title: string;
    description: string;
    icon: any;
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
    return (
        // Added 'group' here so the internal elements can respond to hover
        <Card className="group relative overflow-hidden w-full bg-white h-[300px] rounded-2xl border-zinc-200 border p-8 flex flex-col items-center justify-center transition-all duration-700 hover:shadow-lg">

            {/* HEADER & FOOTER: Now responds to 'group-hover' on the parent Card */}
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out group-hover:opacity-0 group-hover:pointer-events-none">
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-2xl bg-[#f0b100]/10 flex justify-center items-center w-16 h-16 shrink-0">
                        <Icon className="size-8 text-[#f0b100]" />
                    </div>
                    <h3 className="font-bold text-xl text-zinc-950">{title}</h3>
                </div>

                <div className="pt-6 font-semibold text-[#f0b100] text-sm flex items-center gap-2">
                    Learn more <ArrowRight className="size-4" />
                </div>
            </div>

            {/* DESCRIPTION: Now responds to 'group-hover' on the parent Card */}
            <div className="absolute inset-0 p-8 flex items-center justify-center text-center opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                <p className="leading-relaxed text-[#71717b] text-base">
                    {description}
                </p>
            </div>

        </Card>
    );
}