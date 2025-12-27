"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useSettingsStore } from "@/store/settings-store";

function MouseTrailer() {
    const { mouseTrailText, isMouseTrailEnabled, subscribeToSettings } = useSettingsStore();

    // Init off-screen to prevent flash
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth spring physics
    const springConfig = { damping: 25, stiffness: 300, mass: 0.1 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Subscribe to real-time changes
        const unsubscribe = subscribeToSettings();

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            unsubscribe();
        };
    }, [mouseX, mouseY, subscribeToSettings]);

    if (!isMouseTrailEnabled) return null;

    return (
        <motion.div
            style={{ x: springX, y: springY }}
            className="fixed top-0 left-0 pointer-events-none z-[9999] text-amber-500 font-bold text-lg whitespace-nowrap ml-4 mt-4 drop-shadow-md"
        >
            {mouseTrailText}
        </motion.div>
    );
}

export default MouseTrailer;
