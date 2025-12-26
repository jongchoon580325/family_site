"use client";

import { useState } from "react";
import { Lock, Save, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export function AdminPasswordSection() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const { changePassword } = useAuthStore();

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword.length < 4) {
            setMessage({ text: "비밀번호는 4자 이상이어야 합니다.", type: "error" });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ text: "비밀번호가 일치하지 않습니다.", type: "error" });
            return;
        }

        setIsLoading(true);
        try {
            await changePassword(newPassword);
            setMessage({ text: "비밀번호가 성공적으로 변경되었습니다.", type: "success" });
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error(error);
            setMessage({ text: "비밀번호 변경에 실패했습니다.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200">
            <h3 className="text-lg font-serif font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" />
                Admin Password Management
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="새 비밀번호 입력"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="비밀번호 확인"
                    />
                </div>

                {message && (
                    <div className={`text-sm flex items-center gap-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !newPassword}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Change Password
                </button>
            </form>
        </div>
    );
}
