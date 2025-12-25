"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TreeDeciduous, Menu, X, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { name: "HOME", href: "/" },
    {
        name: "Photo",
        href: "/photo/nakibong-kimphilja",
        subItems: [
            { name: "나기봉.김필자", href: "/photo/nakibong-kimphilja" },
            { name: "나종춘.장명애", href: "/photo/najongchoon-jangmyeongae" },
            { name: "나종섭.김양진", href: "/photo/najongseob-kimyangjin" },
            { name: "나신숙.김진수", href: "/photo/nashinsook-kimjinsu" },
            { name: "나한나.정기원", href: "/photo/nahanna-jeongkiwon" },
            { name: "나요한.형정순", href: "/photo/nayohan-hyeongjeongsun" },
        ]
    },
    { name: "Tree", href: "/tree" },
    { name: "Mom", href: "/mom" },
    { name: "Story", href: "/story" },
    { name: "Donates", href: "/donates" },
    { name: "Manager", href: "/manager" },
];

export function Header() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const pathname = usePathname();

    const handleLogoClick = (e: React.MouseEvent) => {
        if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-secondary/10 bg-background/80 backdrop-blur-md transition-all">
            <div className="container mx-auto flex h-20 items-center justify-between px-6">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 group"
                    onClick={handleLogoClick}
                >
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <TreeDeciduous className="h-6 w-6" />
                    </div>
                    <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                        창조주 하나님만 섬기는 가정
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 md:flex" onMouseLeave={() => setHoveredIndex(null)}>
                    {NAV_ITEMS.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <div key={item.name} className="relative group/menu">
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "relative px-4 py-2 text-lg transition-colors duration-200", // Increased to 18px (text-lg)
                                        isActive ? "text-primary font-medium" : "text-secondary hover:text-primary font-normal hover:font-medium"
                                    )}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                >
                                    <span className="relative z-10 flex items-center gap-1">
                                        {item.name}
                                        {item.subItems && <ChevronDown className="h-4 w-4 text-secondary/70 group-hover/menu:rotate-180 transition-transform duration-200" />}
                                    </span>

                                    {/* Floating Pill Background */}
                                    {hoveredIndex === index && (
                                        <motion.div
                                            className="absolute inset-0 z-0 rounded-full bg-secondary/5"
                                            layoutId="hoverBackground"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1, transition: { duration: 0.15 } }}
                                            exit={{ opacity: 0 }}
                                        />
                                    )}
                                </Link>

                                {/* Desktop Dropdown */}
                                {item.subItems && (
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 transform translate-y-2 group-hover/menu:translate-y-0">
                                        <div className="w-48 overflow-hidden rounded-xl border border-amber-200/30 bg-stone-800/95 p-1 shadow-xl backdrop-blur-md">
                                            {item.subItems.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className="block rounded-lg px-4 py-2.5 text-sm text-center text-stone-200 hover:bg-amber-500/20 hover:text-amber-300 transition-colors"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Utilities */}
                <div className="hidden items-center gap-4 md:flex">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:bg-secondary/10 transition-colors" aria-label="Search">
                        <Search className="h-5 w-5" />
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-md md:hidden text-foreground hover:bg-secondary/10"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-background md:hidden border-b border-secondary/10"
                    >
                        <nav className="flex flex-col p-4 space-y-2">
                            {NAV_ITEMS.map((item) => (
                                <div key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "block rounded-lg px-4 py-3 text-lg font-medium transition-colors hover:bg-secondary/5 hover:text-primary",
                                            pathname === item.href ? "bg-secondary/5 text-primary" : "text-foreground"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="flex items-center justify-between">
                                            {item.name}
                                            {item.subItems && <ChevronDown className="h-5 w-5 opacity-50" />}
                                        </div>
                                    </Link>
                                    {/* Mobile Subitems */}
                                    {item.subItems && (
                                        <div className="ml-4 mt-2 space-y-1 border-l-2 border-secondary/10 pl-4">
                                            {item.subItems.map(sub => (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className="block rounded-lg px-4 py-3 text-base text-secondary hover:text-primary"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
