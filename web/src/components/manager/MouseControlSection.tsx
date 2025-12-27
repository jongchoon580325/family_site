"use client";

import { useState, useEffect } from "react";
import { MousePointer2, Save, Power, CheckCircle, AlertTriangle } from "lucide-react";
import { useSettingsStore } from "@/store/settings-store";

export function MouseControlSection() {
    const { mouseTrailText, isMouseTrailEnabled, updateSettings, fetchSettings, isLoading } = useSettingsStore();
    const [localText, setLocalText] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initial fetch
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Sync local state with store
    useEffect(() => {
        setLocalText(mouseTrailText);
    }, [mouseTrailText]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMessage(null);

        try {
            await updateSettings({ mouseTrailText: localText });
            setStatusMessage({ type: 'success', text: "텍스트가 저장되었습니다." });
        } catch (error) {
            console.error(error);
            setStatusMessage({ type: 'error', text: "저장에 실패했습니다." });
        } finally {
            setIsSaving(false);
            // Clear message after 3 seconds
            setTimeout(() => setStatusMessage(null), 3000);
        }
    };

    const toggleEnabled = async () => {
        try {
            await updateSettings({ isMouseTrailEnabled: !isMouseTrailEnabled });
        } catch (error) {
            console.error(error);
            alert("설정 변경에 실패했습니다.");
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-stone-500">Loading settings...</div>;
    }

    return (
        <div className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MousePointer2 className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-stone-800">Mouse Control</h3>
                </div>
                <button
                    onClick={toggleEnabled}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isMouseTrailEnabled
                        ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                >
                    <Power className={`w-4 h-4 ${isMouseTrailEnabled ? 'text-indigo-600' : 'text-stone-400'}`} />
                    {isMouseTrailEnabled ? 'Active' : 'Disabled'}
                </button>
            </div>

            <div className="p-6">
                <p className="text-sm text-stone-600 mb-6">
                    마우스 커서를 따라다니는 텍스트 효과를 설정합니다. 짧은 단어나 이모지를 추천합니다.
                </p>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Trailing Text
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={localText}
                                onChange={(e) => setLocalText(e.target.value)}
                                maxLength={20}
                                placeholder="e.g. ♥ Love"
                                className="flex-1 px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button
                                type="submit"
                                disabled={isSaving || localText === mouseTrailText}
                                className="px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                                <Save className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-stone-400 mt-2">
                            최대 20자까지 입력 가능합니다.
                        </p>
                    </div>

                    <div className="flex items-center justify-between h-6">
                        {statusMessage && (
                            <div className={`flex items-center gap-2 text-sm ${statusMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {statusMessage.type === 'success' ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : (
                                    <AlertTriangle className="w-4 h-4" />
                                )}
                                {statusMessage.text}
                            </div>
                        )}
                    </div>
                </form>

                <div className="mt-6 pt-6 border-t border-stone-200">
                    <h4 className="text-sm font-bold text-stone-700 mb-2">Preview</h4>
                    <div className="bg-white p-8 rounded-lg border border-stone-200 flex items-center justify-center relative overflow-hidden h-32 dashed-pattern">
                        <div className="absolute inset-0 bg-stone-50/50" />
                        <div className="relative flex items-center gap-2">
                            <MousePointer2 className="w-6 h-6 text-stone-400 transform -rotate-12" />
                            {isMouseTrailEnabled && (
                                <span className="text-amber-500 font-bold ml-4 drop-shadow-md">
                                    {localText || "Text"}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
