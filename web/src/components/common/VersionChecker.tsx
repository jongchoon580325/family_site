'use client';

import { useEffect, useState } from 'react';
import { APP_VERSION } from '@/version';
import { RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function VersionChecker() {
    const [hasUpdate, setHasUpdate] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Function to check for updates
        const checkForUpdate = async () => {
            try {
                // Fetch the version.json from the server/CDN
                // Add timestamp to prevent caching of version.json itself
                const res = await fetch(`/version.json?t=${new Date().getTime()}`);
                if (!res.ok) return;

                const data = await res.json();
                const latestVersion = data.version;

                // Compare current built version with latest deployed version
                if (latestVersion && latestVersion !== APP_VERSION) {
                    console.log('Update found!', { current: APP_VERSION, latest: latestVersion });
                    setHasUpdate(true);
                    setIsVisible(true);
                }
            } catch (error) {
                console.error('Failed to check version:', error);
            }
        };

        // Check immediately on mount
        checkForUpdate();

        // Check when window gets focus (user comes back to tab)
        window.addEventListener('focus', checkForUpdate);

        // Optional: Poll every 1 minute
        const interval = setInterval(checkForUpdate, 60 * 1000);

        return () => {
            window.removeEventListener('focus', checkForUpdate);
            clearInterval(interval);
        };
    }, []);

    const handleUpdate = () => {
        // Hard reload to clear cache and get new assets
        window.location.reload();
    };

    if (!hasUpdate) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
                >
                    <div className="bg-amber-900/95 backdrop-blur-sm text-amber-50 p-4 rounded-xl shadow-2xl border border-amber-500/30 flex items-center justify-between gap-4">
                        <div>
                            <p className="font-bold text-sm">새로운 버전이 출시되었습니다 ✨</p>
                            <p className="text-xs text-amber-200/80 mt-1">최신 기능을 위해 앱을 업데이트해주세요.</p>
                        </div>
                        <button
                            onClick={handleUpdate}
                            className="bg-amber-500 hover:bg-amber-400 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                            aria-label="Update App"
                        >
                            <RotateCw className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
