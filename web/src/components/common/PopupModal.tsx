"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, CheckSquare, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSettingsStore } from "@/store/settings-store";

export function PopupModal() {
    const { popupSettings, subscribeToSettings } = useSettingsStore();

    const [isVisible, setIsVisible] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Default muted for autoplay

    const {
        isActive,
        title,
        content,
        imageUrl,
        videoUrl, // Add videoUrl here
        linkUrl,
        id,
        startDate,
        endDate
    } = popupSettings;

    useEffect(() => {
        const unsubscribe = subscribeToSettings();
        return () => unsubscribe();
    }, [subscribeToSettings]);

    useEffect(() => {
        // Logic to check display conditions
        if (!isActive) {
            setIsVisible(false);
            return;
        }

        // 1. Date Check
        if (startDate || endDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (startDate) {
                const start = new Date(startDate);
                if (today < start) {
                    setIsVisible(false);
                    return;
                }
            }

            if (endDate) {
                const end = new Date(endDate);
                if (today > end) {
                    setIsVisible(false);
                    return;
                }
            }
        }

        // 2. Local Storage Check ("Don't show today")
        const hiddenUntil = localStorage.getItem(`popup_hide_${id}`);
        if (hiddenUntil) {
            const hideDate = new Date(parseInt(hiddenUntil));
            const now = new Date();

            // If hidden date is today (same day), don't show
            if (hideDate.getDate() === now.getDate() &&
                hideDate.getMonth() === now.getMonth() &&
                hideDate.getFullYear() === now.getFullYear()) {
                setIsVisible(false);
                return;
            }
        }

        setIsVisible(true);
    }, [popupSettings, isActive, id, startDate, endDate]);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleDontShowToday = () => {
        const now = new Date();
        localStorage.setItem(`popup_hide_${id}`, now.getTime().toString());
        setIsVisible(false);
    };

    // Prevent rendering if not client or not visible
    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10"
                    >
                        {/* Media Banner (Video or Image) */}
                        {videoUrl ? (
                            <div className="relative w-full h-48 sm:h-56 bg-black group">
                                <video
                                    src={videoUrl}
                                    autoPlay
                                    loop
                                    muted={isMuted}
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMuted(!isMuted);
                                    }}
                                    className="absolute bottom-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-sm z-20"
                                >
                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                            </div>
                        ) : imageUrl ? (
                            <div className="relative w-full h-48 sm:h-56 bg-stone-100">
                                <Image
                                    src={imageUrl}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/10" />
                            </div>
                        ) : null}

                        <div className="p-6">
                            <h3 className="text-xl font-bold font-serif text-stone-800 mb-3 text-center sm:text-left">
                                {title}
                            </h3>
                            <div
                                className="prose prose-sm prose-stone mb-6 text-stone-600 whitespace-pre-line text-center sm:text-left max-w-none [&>:first-child]:mt-0"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />

                            {linkUrl && (
                                <Link
                                    href={linkUrl}
                                    className="block w-full py-3 mb-2 text-center bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors font-medium text-sm"
                                    onClick={handleClose}
                                >
                                    자세히 보기
                                </Link>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex border-t border-stone-100 divide-x divide-stone-100">
                            <button
                                onClick={handleDontShowToday}
                                className="flex-1 py-3 text-sm text-stone-500 hover:bg-stone-50 transition-colors font-medium flex items-center justify-center gap-2"
                            >
                                <CheckSquare className="w-4 h-4 text-stone-500" />
                                <span>오늘 하루 그만 보기</span>
                            </button>
                            <button
                                onClick={handleClose}
                                className="flex-1 py-3 text-sm text-stone-800 hover:bg-stone-50 transition-colors font-bold"
                            >
                                닫기
                            </button>
                        </div>

                        {/* Close Icon (Top Right) */}
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors z-20"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
