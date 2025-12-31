"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface InteractivePhotoCardProps {
    defaultSrc: string;
    hoverSrc: string;
    alt: string;
    hasSound?: boolean;
}

export function InteractivePhotoCard({ defaultSrc, hoverSrc, alt, hasSound = false }: InteractivePhotoCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Mouse position state
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for tilt
    const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

    // Calculate rotation based on mouse position relative to center
    // Range: -20deg to 20deg
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["20deg", "-20deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-20deg", "20deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        // Calculate normalized position (-0.5 to 0.5)
        const width = rect.width;
        const height = rect.height;

        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;

        const xPct = (mouseXPos / width) - 0.5;
        const yPct = (mouseYPos / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        // Reset tilt on leave
        x.set(0);
        y.set(0);
    };

    return (
        <div
            ref={ref}
            className="relative w-full h-full perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: "1000px" }}
        >
            {/* Default Image - Always present but hidden when hovered (or covered) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <Image
                    src={defaultSrc}
                    alt={alt}
                    fill
                    className="object-cover rounded-lg"
                    priority
                />
            </div>

            {/* Hover Image Layer with 3D Effect */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0,
                            rotate: 720, // Spin 2 times (Vortex effect)
                            transition: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }
                        }}
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d",
                            zIndex: 10
                        }}
                        // Added thick amber border and glowing shadow
                        className="absolute inset-0 w-full h-full rounded-lg overflow-hidden border-8 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.6)] bg-black"
                    >
                        {hoverSrc.endsWith('.mp4') ? (
                            <div className="w-full h-full bg-black">
                                <video
                                    src={hoverSrc}
                                    autoPlay
                                    loop
                                    muted={!hasSound}
                                    playsInline
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ) : (
                            <Image
                                src={hoverSrc}
                                alt={`${alt} 3D View`}
                                fill
                                className="object-cover"
                                priority
                            />
                        )}

                        {/* Enhanced Glossy Reflection */}
                        <div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none"
                            style={{ mixBlendMode: 'overlay' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
