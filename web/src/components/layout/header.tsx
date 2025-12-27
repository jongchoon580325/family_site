"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TreeDeciduous, Menu, X, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AdminLoginModal } from "@/components/auth/AdminLoginModal";
import { SearchModal } from "@/components/common/SearchModal";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";


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
    const [showLoginModal, setShowLoginModal] = React.useState(false);

    // Global UI State
    const { isSearchOpen, setSearchOpen } = useUIStore();

    const [expandedMobile, setExpandedMobile] = React.useState<string[]>([]);

    const toggleMobileSub = (name: string) => {
        setExpandedMobile(prev =>
            prev.includes(name)
                ? prev.filter(n => n !== name)
                : [...prev, name]
        );
    };

    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    const handleLogoClick = (e: React.MouseEvent) => {
        if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNavClick = (e: React.MouseEvent, href: string) => {
        if (href === "/manager" && !isAuthenticated) {
            e.preventDefault();
            setShowLoginModal(true);
            setIsOpen(false);
            return;
        }
        setIsOpen(false);
    };

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        router.push("/manager");
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
                                    onClick={(e) => handleNavClick(e, item.href)}
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
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:bg-secondary/10 transition-colors"
                        aria-label="Search"
                    >
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
                            {NAV_ITEMS.map((item) => {
                                const isExpanded = expandedMobile.includes(item.name);
                                const hasSub = !!item.subItems;

                                return (
                                    <div key={item.name}>
                                        <div className={cn(
                                            "flex items-center justify-between rounded-lg transition-colors hover:bg-secondary/5",
                                            pathname === item.href ? "bg-secondary/5 text-primary" : "text-foreground"
                                        )}>
                                            <Link
                                                href={item.href}
                                                onClick={(e) => handleNavClick(e, item.href)}
                                                className="flex-1 px-4 py-3 text-lg font-medium"
                                            >
                                                {item.name}
                                            </Link>
                                            {hasSub && (
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleMobileSub(item.name);
                                                    }}
                                                    className="px-4 py-3 text-secondary hover:text-primary transition-colors"
                                                >
                                                    <ChevronDown className={cn(
                                                        "h-5 w-5 transition-transform duration-200",
                                                        isExpanded && "rotate-180"
                                                    )} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Mobile Subitems */}
                                        <AnimatePresence>
                                            {hasSub && isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-secondary/10 pl-4 py-2">
                                                        {item.subItems!.map(sub => (
                                                            <Link
                                                                key={sub.name}
                                                                href={sub.href}
                                                                className="block rounded-lg px-4 py-3 text-base text-secondary hover:text-primary hover:bg-secondary/5 transition-colors"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
            <AdminLoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setSearchOpen(false)}
            />
        </header>
    );
}
