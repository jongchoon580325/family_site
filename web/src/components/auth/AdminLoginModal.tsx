"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface AdminLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

export function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { login } = useAuthStore();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const success = await login(password);
            if (success) {
                onLoginSuccess();
                setPassword("");
            } else {
                setError("비밀번호가 올바르지 않습니다.");
            }
        } catch (err) {
            setError("로그인 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl z-10"
                    >
                        {/* Close Button - Global Position */}
                        <button
                            onClick={onClose}
                            className="absolute right-3 top-3 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-50 shadow-sm border border-white/10"
                            title="닫기"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="bg-stone-900 p-6 text-white text-center relative">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-800">
                                <Lock className="h-6 w-6 text-amber-500" />
                            </div>
                            <h2 className="text-lg font-semibold">관리자 접속</h2>
                            <p className="mt-1 text-sm text-stone-400">관리자 비밀번호를 입력해 주세요.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="w-full rounded-lg border border-stone-200 px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
                                        autoFocus
                                    />
                                    {error && (
                                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                            <X className="w-3 h-3" /> {error}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full rounded-lg bg-stone-900 py-3 font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            확인 중...
                                        </>
                                    ) : (
                                        "접속하기"
                                    )}
                                </button>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-xs text-stone-400">
                                    관리자 외에는 접속할 수 없습니다.
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
