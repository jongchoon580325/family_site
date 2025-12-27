"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, BookOpen, TreeDeciduous, Image as ImageIcon, ChevronRight } from "lucide-react";
import { useStoryStore } from "@/store/story-store";
import { useFamilyTreeStore } from "@/store/family-tree-store";
import { GALLERY_CATEGORIES } from "@/types/gallery";
import { cn } from "@/lib/utils";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchResult {
    id: string;
    type: 'story' | 'tree' | 'gallery';
    title: string;
    description?: string;
    href: string;
    date?: string;
    matchType?: string;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Stores
    const { stories } = useStoryStore();
    const { getAllMembers } = useFamilyTreeStore();

    // Reset when opening
    React.useEffect(() => {
        if (isOpen) {
            setQuery("");
            setResults([]);
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Search Logic
    React.useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        setIsSearching(true);

        const timer = setTimeout(() => {
            const allResults: SearchResult[] = [];

            // 1. Search Stories
            stories.forEach(story => {
                const titleMatch = story.title.toLowerCase().includes(searchTerm);
                const contentMatch = story.content.toLowerCase().includes(searchTerm);

                if (titleMatch || contentMatch) {
                    allResults.push({
                        id: `story-${story.id}`,
                        type: 'story',
                        title: story.title,
                        description: contentMatch
                            ? `...${story.content.substring(Math.max(0, story.content.toLowerCase().indexOf(searchTerm) - 20), story.content.toLowerCase().indexOf(searchTerm) + 40)}...`
                            : story.content.substring(0, 60) + "...",
                        href: `/story?id=${story.id}`, // Assuming story page supports id param or similar anchor
                        date: new Date(story.date).toLocaleDateString(),
                        matchType: titleMatch ? 'Title' : 'Content'
                    });
                }
            });

            // 2. Search Family Tree
            const members = getAllMembers();
            members.forEach(member => {
                const nameKoMatch = member.name.ko.toLowerCase().includes(searchTerm);
                const nameEnMatch = member.name.en.toLowerCase().includes(searchTerm);
                const spouseKoMatch = member.spouse?.ko?.toLowerCase().includes(searchTerm);

                if (nameKoMatch || nameEnMatch || spouseKoMatch) {
                    let title = `${member.name.ko} (${member.name.en})`;
                    if (spouseKoMatch) {
                        title += ` & ${member.spouse?.ko}`;
                    }

                    allResults.push({
                        id: `tree-${member.id}`,
                        type: 'tree',
                        title: title,
                        description: "Family Tree Member",
                        href: `/tree?highlight=${member.id}`, // Assuming Tree page supports highlight
                    });
                }
            });

            // 3. Search Gallery Categories
            GALLERY_CATEGORIES.forEach(cat => {
                const nameKoMatch = cat.nameKo.toLowerCase().includes(searchTerm);
                const nameEnMatch = cat.nameEn.toLowerCase().includes(searchTerm);

                if (nameKoMatch || nameEnMatch) {
                    allResults.push({
                        id: `gallery-${cat.id}`,
                        type: 'gallery',
                        title: cat.nameKo,
                        description: cat.nameEn,
                        href: cat.path,
                    });
                }
            });

            setResults(allResults);
            setIsSearching(false);
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query, stories, getAllMembers]);

    // Keyboard Navigation (Simple Close on Esc)
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-stone-950/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed left-0 right-0 top-20 z-[101] mx-auto w-full max-w-2xl px-4"
                    >
                        <div className="overflow-hidden rounded-2xl border border-stone-200/20 bg-stone-900/95 shadow-2xl backdrop-blur-md">
                            {/* Search Header */}
                            <div className="relative border-b border-stone-800 px-4 py-4">
                                <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-500" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search stories, family members, albums..."
                                    className="w-full bg-transparent px-10 py-2 text-lg text-stone-100 placeholder:text-stone-600 focus:outline-none"
                                />
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-stone-500 hover:bg-stone-800 hover:text-stone-300 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Results Area */}
                            <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
                                {isSearching ? (
                                    <div className="flex h-32 items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="space-y-1">
                                        {/* Group by Type or just Flat List? Flat list with icons is easier for now */}
                                        {results.map((result) => (
                                            <Link
                                                key={result.id}
                                                href={result.href}
                                                onClick={onClose}
                                                className="group flex items-start gap-3 rounded-xl p-3 hover:bg-stone-800/80 transition-colors"
                                            >
                                                <div className={cn(
                                                    "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-700/50 bg-stone-800",
                                                    result.type === 'story' && "text-amber-500",
                                                    result.type === 'tree' && "text-emerald-500",
                                                    result.type === 'gallery' && "text-pink-500",
                                                )}>
                                                    {result.type === 'story' && <BookOpen className="h-4 w-4" />}
                                                    {result.type === 'tree' && <TreeDeciduous className="h-4 w-4" />}
                                                    {result.type === 'gallery' && <ImageIcon className="h-4 w-4" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-stone-200 group-hover:text-amber-400 transition-colors truncate">
                                                            {result.title}
                                                        </span>
                                                        {result.date && (
                                                            <span className="text-xs text-stone-500">{result.date}</span>
                                                        )}
                                                    </div>
                                                    {result.description && (
                                                        <p className="text-sm text-stone-500 line-clamp-1">
                                                            {result.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-stone-700 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        ))}
                                    </div>
                                ) : query ? (
                                    <div className="flex h-32 flex-col items-center justify-center gap-2 text-stone-500">
                                        <p>No results found for &quot;{query}&quot;</p>
                                    </div>
                                ) : (
                                    // Empty State Suggestions
                                    <div className="px-4 py-8">
                                        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-600">
                                            Suggested Searches
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {['나기봉', '여행', 'Story', 'Family'].map((tag) => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setQuery(tag)}
                                                    className="rounded-full border border-stone-800 bg-stone-900 px-3 py-1 text-sm text-stone-400 hover:border-amber-500/50 hover:text-amber-400 transition-colors"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-stone-800 bg-stone-900/50 px-4 py-2 text-xs text-stone-600 flex justify-between">
                                <span>Press <kbd className="font-sans px-1 rounded bg-stone-800 text-stone-400">Esc</kbd> to close</span>
                                <span>{results.length} results</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
