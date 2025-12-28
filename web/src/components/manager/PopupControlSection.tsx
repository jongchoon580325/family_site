"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Save, Power, Image as ImageIcon, Link as LinkIcon, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { useSettingsStore, PopupSettings } from "@/store/settings-store";
import Image from "next/image";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function PopupControlSection() {
    const { popupSettings, updateSettings, fetchSettings, isLoading } = useSettingsStore();
    const [localSettings, setLocalSettings] = useState<PopupSettings>(popupSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initial fetch
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // Sync local state with store
    useEffect(() => {
        if (popupSettings) {
            setLocalSettings(popupSettings);
        }
    }, [popupSettings]);

    const handleChange = (field: keyof PopupSettings, value: any) => {
        setLocalSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMessage(null);

        // If ID is empty or we want to force a reset for users who hid it, we might generate a new ID.
        // But let's keep ID stable unless explicitly reset?
        // Let's ensure ID exists.
        const settingsToSave = {
            ...localSettings,
            id: localSettings.id || Date.now().toString()
        };

        try {
            await updateSettings({ popupSettings: settingsToSave });
            setStatusMessage({ type: 'success', text: "설정이 저장되었습니다." });
        } catch (error) {
            console.error(error);
            setStatusMessage({ type: 'error', text: "저장에 실패했습니다." });
        } finally {
            setIsSaving(false);
            setTimeout(() => setStatusMessage(null), 3000);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }

        setIsImageUploading(true);
        try {
            const storageRef = ref(storage, `popup/${Date.now()}-${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);
            handleChange('imageUrl', downloadUrl);
        } catch (error) {
            console.error(error);
            alert("이미지 업로드 실패");
        } finally {
            setIsImageUploading(false);
        }
    };

    const handleResetID = () => {
        if (confirm("ID를 재설정하면 '오늘 하루 보지 않기'를 선택한 사용자들에게도 다시 팝업이 표시됩니다. 진행하시겠습니까?")) {
            handleChange('id', Date.now().toString());
            setStatusMessage({ type: 'success', text: "ID가 재설정되었습니다. (저장 필요)" });
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-stone-500">Loading settings...</div>;
    }

    return (
        <div className="bg-stone-50 rounded-xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-rose-600" />
                    <h3 className="font-bold text-stone-800">Popup Control</h3>
                </div>
                <button
                    onClick={() => {
                        const newState = !localSettings.isActive;
                        handleChange('isActive', newState);
                        // Auto save on toggle? Or just update local? 
                        // UX: usually toggle saves immediately or we wait for save button.
                        // Let's wait for Save button to be consistent with form.
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${localSettings.isActive
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                >
                    <Power className={`w-4 h-4 ${localSettings.isActive ? 'text-rose-600' : 'text-stone-400'}`} />
                    {localSettings.isActive ? 'Active' : 'Disabled'}
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={localSettings.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 outline-none"
                            placeholder="공지사항 제목"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1 flex items-center justify-between">
                            Content
                            <span className="text-xs text-rose-500 font-normal">HTML Supported (e.g. &lt;strong&gt;, &lt;br/&gt;)</span>
                        </label>
                        <textarea
                            rows={6}
                            value={localSettings.content}
                            onChange={(e) => handleChange('content', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 outline-none resize-y font-mono text-sm"
                            placeholder="공지 내용을 입력하세요. (HTML 태그 사용 가능)"
                        />
                    </div>

                    {/* Date Range Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" /> Start Date
                            </label>
                            <input
                                type="date"
                                value={localSettings.startDate || ''}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" /> End Date
                            </label>
                            <input
                                type="date"
                                value={localSettings.endDate || ''}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 outline-none"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-stone-400 -mt-3">
                        * 비워두면 기간 제한 없이 표시됩니다.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={localSettings.imageUrl || ''}
                                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 outline-none pl-10"
                                    placeholder="https://..."
                                />
                                <ImageIcon className="absolute left-3 top-2.5 w-5 h-5 text-stone-400" />
                            </div>
                            <label className="px-4 py-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 cursor-pointer transition-colors flex items-center justify-center">
                                <span className="text-sm font-medium whitespace-nowrap">Upload</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isImageUploading} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Link URL (Optional)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={localSettings.linkUrl || ''}
                                onChange={(e) => handleChange('linkUrl', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-rose-500 outline-none pl-10"
                                placeholder="https://..."
                            />
                            <LinkIcon className="absolute left-3 top-2.5 w-5 h-5 text-stone-400" />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={handleResetID}
                            className="px-4 py-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium"
                            title="모든 사용자의 '오늘 하루 보지 않기' 기록을 초기화합니다"
                        >
                            Reset Visibility
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                        >
                            {isSaving ? 'Saving...' : 'Save Settings'}
                            <Save className="w-4 h-4" />
                        </button>
                    </div>

                    {statusMessage && (
                        <div className={`flex items-center gap-2 text-sm justify-center ${statusMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                            {statusMessage.text}
                        </div>
                    )}
                </form>

                {/* Preview Section */}
                <div>
                    <h4 className="text-sm font-bold text-stone-700 mb-2">Live Preview</h4>
                    <div className="bg-stone-900/5 p-4 rounded-xl border border-stone-200 h-full min-h-[400px] flex items-center justify-center relative dashed-pattern">
                        {/* Mock Popup */}
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform scale-90 sm:scale-100 transition-all">
                            {localSettings.imageUrl ? (
                                <div className="relative w-full h-40 bg-stone-100">
                                    <Image
                                        src={localSettings.imageUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-6 bg-rose-50 border-b border-rose-100" />
                            )}
                            <div className="p-5">
                                <h3 className="text-lg font-bold font-serif text-stone-800 mb-2">
                                    {localSettings.title || "Popup Title"}
                                </h3>
                                <div
                                    className="text-sm text-stone-600 mb-4 whitespace-pre-line prose prose-sm max-w-none [&>:first-child]:mt-0"
                                    dangerouslySetInnerHTML={{ __html: localSettings.content || "Popup content will appear here..." }}
                                />
                                {localSettings.linkUrl && (
                                    <div className="block w-full py-2 mb-2 text-center bg-stone-800 text-white rounded-md text-xs font-medium opacity-80">
                                        자세히 보기
                                    </div>
                                )}
                            </div>
                            <div className="flex border-t border-stone-100 divide-x divide-stone-100">
                                <div className="flex-1 py-2 text-xs text-center text-stone-400">
                                    오늘 하루 그만 보기
                                </div>
                                <div className="flex-1 py-2 text-xs text-center text-stone-800 font-bold">
                                    닫기
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
