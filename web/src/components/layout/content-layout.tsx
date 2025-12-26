"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ContentLayoutProps {
    title: React.ReactNode | string;
    description?: React.ReactNode | string;
    headerImage?: string;
    children: React.ReactNode;
}

export function ContentLayout({
    title,
    description,
    headerImage = "/images/common/top-head-img.png",
    children,
}: ContentLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <div className="w-full relative">
                <Image
                    src={headerImage}
                    alt={typeof title === 'string' ? title : "Header Image"}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-contain"
                    priority
                />
            </div>

            {/* Title & Description Section */}
            <div className="container mx-auto px-4 py-6 md:py-12 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="font-gowun text-3xl md:text-5xl font-bold text-foreground mb-4"
                >
                    {title}
                </motion.h1>

                {description && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="font-gowun text-base md:text-xl text-secondary max-w-2xl mx-auto"
                    >
                        {description}
                    </motion.p>
                )}
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 md:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}
