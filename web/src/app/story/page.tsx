"use client";

import { ContentLayout } from "@/components/layout/content-layout";
import { BookOpen, Quote, Video, Image as ImageIcon, X, Play } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useStoryStore, type StoryItem } from "@/store/story-store";
import { useEffect, useState } from "react";

export default function StoryPage() {
    const { stories, fetchStories, isLoading } = useStoryStore();
    const [selectedItem, setSelectedItem] = useState<StoryItem | null>(null);

    // Fetch stories from Firebase on mount
    useEffect(() => {
        fetchStories();
    }, [fetchStories]);
    // Prevent hydration mismatch
    // if (!isClient) { ... }

    return (
        <ContentLayout
            title={
                <span className="flex items-center justify-center gap-3">
                    <BookOpen className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
                    우리 가족 이야기
                </span>
            }
            description="우리 가족 사랑 이야기를 함께 나눕니다."
            headerImage="/images/common/top-imgs/03-story.png"
        >
            <div className="max-w-7xl mx-auto">
                {/* Masonry Grid Container */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {stories.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => setSelectedItem(item)}
                            className={`break-inside-avoid rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${item.type === 'quote' ? '' : 'bg-white'} hover:-translate-y-1`}
                        >
                            {/* Card Content based on Type */}
                            {item.type === 'text' && (
                                <div className={`p-6 ${item.color} h-full`}>
                                    <h3 className="font-serif text-xl font-bold mb-3 text-amber-900">{item.title}</h3>
                                    <p className="text-stone-700 leading-relaxed font-gowun line-clamp-4 whitespace-pre-line">{item.content}</p>
                                    <p className="text-right text-sm text-stone-500 mt-4">{item.date}</p>
                                </div>
                            )}

                            {item.type === 'quote' && (
                                <div className={`p-8 ${item.color} text-center flex flex-col items-center justify-center min-h-[220px] h-full`}>
                                    <Quote className="w-8 h-8 mb-4 opacity-50" />
                                    <p className="font-serif text-xl md:text-2xl leading-relaxed mb-4">
                                        &quot;{item.content}&quot;
                                    </p>
                                    <p className="text-sm opacity-70">- {item.author}</p>
                                </div>
                            )}

                            {item.type === 'image' && (
                                <div className="relative group">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                                        <Image
                                            src={item.src!}
                                            alt={item.title!}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <span className="text-white font-medium px-4 py-2 border border-white rounded-full">View Photo</span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2 text-amber-700">
                                            <ImageIcon className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">Photo Story</span>
                                        </div>
                                        <h3 className="font-serif text-lg font-bold mb-2">{item.title}</h3>
                                        <p className="text-stone-600 text-sm mb-3 line-clamp-2">{item.content}</p>
                                        <p className="text-xs text-stone-400">{item.date}</p>
                                    </div>
                                </div>
                            )}

                            {item.type === 'video' && (
                                <div className="bg-white">
                                    <div className="relative aspect-video bg-black overflow-hidden">
                                        {/* YouTube Thumbnail */}
                                        {item.videoId && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                                                alt={item.title || "Video thumbnail"}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <Play className="w-6 h-6 text-white ml-1" />
                                            </div>
                                        </div>
                                        <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            Youtube
                                        </span>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2 text-red-700">
                                            <Video className="w-4 h-4" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">Video Log</span>
                                        </div>
                                        <h3 className="font-serif text-lg font-bold mb-2">{item.title}</h3>
                                        <p className="text-stone-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                                        <p className="text-xs text-stone-400">{item.date}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Upload Expansion Hint */}
                <div className="mt-16 text-center">
                    <button className="px-8 py-3 rounded-full border border-stone-300 text-stone-500 hover:border-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-all duration-300 flex items-center gap-2 mx-auto">
                        <span>Load More Stories</span>
                    </button>
                    <p className="text-sm text-stone-400 mt-4">
                        가족의 역사는 계속 기록됩니다.
                    </p>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 custom-scrollbar-hide">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                        />

                        {/* Modal Content */}
                        <motion.div
                            layoutId={`card-${selectedItem.id}`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={`relative bg-white overflow-hidden rounded-2xl shadow-2xl z-10 flex flex-col md:flex-row ${selectedItem.type === 'image' || selectedItem.type === 'video'
                                ? 'w-full max-w-7xl max-h-[95vh]'
                                : 'w-full max-w-4xl max-h-[90vh]'
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-stone-800" />
                            </button>

                            {/* Media Section (Left/Top) */}
                            {(selectedItem.type === 'image' || selectedItem.type === 'video') && (
                                <div className="w-full md:w-3/4 bg-black flex items-center justify-center min-h-[400px] md:min-h-[600px]">
                                    {selectedItem.type === 'image' && (
                                        <div className="relative w-full h-full min-h-[400px] md:min-h-[600px]">
                                            <Image
                                                src={selectedItem.src!}
                                                alt={selectedItem.title!}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                    {selectedItem.type === 'video' && (
                                        <div className="w-full aspect-video">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${selectedItem.videoId}?autoplay=1`}
                                                title={selectedItem.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Content Section (Right/Bottom or Full for text) */}
                            <div className={`p-8 ${selectedItem.type === 'text' || selectedItem.type === 'quote' ? 'w-full' : 'w-full md:w-1/4 border-l border-stone-100'} flex flex-col h-full overflow-y-auto custom-scrollbar`}>
                                {selectedItem.type === 'quote' ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
                                        <Quote className="w-12 h-12 text-amber-900/30" />
                                        <p className="text-2xl md:text-3xl font-serif font-bold text-stone-800 leading-relaxed">
                                            &quot;{selectedItem.content}&quot;
                                        </p>
                                        <div className="w-12 h-1 bg-amber-900/20 rounded-full" />
                                        <p className="text-lg text-stone-500 font-medium">{selectedItem.author}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                                                ${selectedItem.type === 'video' ? 'bg-red-100 text-red-700' :
                                                    selectedItem.type === 'image' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-stone-100 text-stone-700'}`}>
                                                {selectedItem.type.toUpperCase()}
                                            </span>
                                            <span className="text-stone-400 text-sm">{selectedItem.date}</span>
                                        </div>

                                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-6">
                                            {selectedItem.title}
                                        </h2>

                                        <div className="prose prose-stone prose-lg max-w-none">
                                            <p className="whitespace-pre-line text-stone-600 leading-relaxed font-gowun">
                                                {selectedItem.type === 'video' ? selectedItem.description : selectedItem.content}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ContentLayout>
    );
}
