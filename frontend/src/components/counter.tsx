import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, animate } from "framer-motion";

interface CounterProps {
    value: number;
    suffix?: string;
    delay?: number; // Added delay prop in seconds
}

export const Counter = ({ value, suffix = "", delay = 0 }: CounterProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 50, damping: 25 });

    useEffect(() => {
        if (isInView) {
            // Trigger animation after the specified delay
            const timeout = setTimeout(() => {
                animate(0, value, {
                    duration: 2, // Matches the duration of the animation
                    onUpdate: (latest) => motionValue.set(latest),
                });
            }, delay * 1000);

            return () => clearTimeout(timeout);
        }
    }, [isInView, value, motionValue, delay]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest) + suffix;
            }
        });
        return () => unsubscribe();
    }, [springValue, suffix]);

    return <span ref={ref}>0</span>;
};