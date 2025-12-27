"use client";

import { useState, useEffect, useCallback } from "react";
import { ContentLayout } from "@/components/layout/content-layout";
import { useStoryStore, StoryType } from "@/store/story-store";
import { Settings, Upload, Image as ImageIcon, MessageSquare, Video, Trash2, CheckCircle, Save, Quote, X, AlertTriangle, ChevronLeft, ChevronRight, Pencil, TreeDeciduous, Images, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FamilyTreeEditor } from "@/components/manager/FamilyTreeEditor";
import { GalleryEditor } from "@/components/manager/GalleryEditor";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { AdminPasswordSection } from "@/components/manager/AdminPasswordSection";
import { DataBackupSection } from "@/components/manager/DataBackupSection";

type MenuSection = 'story-upload' | 'site-settings' | 'family-tree' | 'gallery';

// Custom Modal Component
function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "확인",
    cancelText = "취소",
    variant = "danger"
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: { icon: "text-red-500", button: "bg-red-600 hover:bg-red-700", iconBg: "bg-red-100" },
        warning: { icon: "text-amber-500", button: "bg-amber-600 hover:bg-amber-700", iconBg: "bg-amber-100" },
        info: { icon: "text-blue-500", button: "bg-blue-600 hover:bg-blue-700", iconBg: "bg-blue-100" }
    };

    const style = variantStyles[variant];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10"
            >
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${style.iconBg}`}>
                        <AlertTriangle className={`w-6 h-6 ${style.icon}`} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-stone-800 mb-1">{title}</h3>
                        <p className="text-sm text-stone-600">{message}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`px-4 py-2 text-white rounded-lg transition-colors font-medium ${style.button}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// Alert Modal Component
function AlertModal({
    isOpen,
    onClose,
    title,
    message,
    variant = "info"
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    variant?: "success" | "error" | "info";
}) {
    if (!isOpen) return null;

    const variantStyles = {
        success: { icon: <CheckCircle className="w-6 h-6 text-green-500" />, iconBg: "bg-green-100" },
        error: { icon: <X className="w-6 h-6 text-red-500" />, iconBg: "bg-red-100" },
        info: { icon: <AlertTriangle className="w-6 h-6 text-blue-500" />, iconBg: "bg-blue-100" }
    };

    const style = variantStyles[variant];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10"
            >
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${style.iconBg}`}>
                        {style.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-stone-800 mb-1">{title}</h3>
                        <p className="text-sm text-stone-600">{message}</p>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-900 transition-colors font-medium"
                    >
                        확인
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default function ManagerPage() {
    const [activeSection, setActiveSection] = useState<MenuSection>('story-upload');
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Auth Protection
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleResetConfirm = () => {
        // Firebase를 사용하므로 localStorage 초기화 불필요
        // 개별 삭제 기능으로 대체
        setShowResetConfirm(false);
        alert('Firebase 연동 후에는 개별 삭제 기능을 사용해주세요.');
    };

    return (
        <ContentLayout
            title="Site Manager"
            description="웹사이트 콘텐츠와 설정을 관리합니다."
            headerImage="/images/common/top-imgs/05-upload.png"
        >
            {/* Reset Confirmation Modal */}
            <ConfirmModal
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={handleResetConfirm}
                title="모든 데이터를 초기화하시겠습니까?"
                message="경고: 업로드한 모든 스토리가 삭제되고 기본 데이터로 초기화됩니다. 이 작업은 취소할 수 없습니다."
                confirmText="초기화"
                cancelText="취소"
                variant="danger"
            />

            <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden sticky top-24">
                        <div className="p-4 bg-stone-50 border-b border-stone-200">
                            <h2 className="font-serif font-bold text-stone-700">Management</h2>
                        </div>
                        <nav className="p-2 space-y-1">
                            <button
                                onClick={() => setActiveSection('story-upload')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === 'story-upload'
                                    ? 'bg-amber-50 text-amber-800 font-medium'
                                    : 'text-stone-600 hover:bg-stone-50'
                                    }`}
                            >
                                <Upload className="w-5 h-5" />
                                Story Upload
                            </button>
                            <button
                                onClick={() => setActiveSection('site-settings')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === 'site-settings'
                                    ? 'bg-amber-50 text-amber-800 font-medium'
                                    : 'text-stone-600 hover:bg-stone-50'
                                    }`}
                            >
                                <Settings className="w-5 h-5" />
                                Site Settings
                            </button>
                            <button
                                onClick={() => setActiveSection('family-tree')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === 'family-tree'
                                    ? 'bg-amber-50 text-amber-800 font-medium'
                                    : 'text-stone-600 hover:bg-stone-50'
                                    }`}
                            >
                                <TreeDeciduous className="w-5 h-5" />
                                Family Tree
                            </button>
                            <button
                                onClick={() => setActiveSection('gallery')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === 'gallery'
                                    ? 'bg-amber-50 text-amber-800 font-medium'
                                    : 'text-stone-600 hover:bg-stone-50'
                                    }`}
                            >
                                <Images className="w-5 h-5" />
                                Gallery
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 bg-white rounded-xl shadow-sm border border-stone-200 p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        {activeSection === 'story-upload' && (
                            <motion.div
                                key="story-upload"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6 flex items-center gap-2">
                                    <Upload className="w-6 h-6 text-amber-600" />
                                    New Story Post
                                </h2>
                                <StoryUploadForm />
                            </motion.div>
                        )}

                        {activeSection === 'site-settings' && (
                            <motion.div
                                key="site-settings"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                <AdminPasswordSection />
                                <DataBackupSection />

                                <div className="p-6 bg-red-50 rounded-xl border border-red-100">
                                    <h3 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-red-600 mb-4">
                                        문제가 발생했을 때 데이터를 초기화할 수 있습니다. (주의: 되돌릴 수 없습니다.)
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowResetConfirm(true)}
                                        className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
                                    >
                                        초기화 (Reset All Data)
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'family-tree' && (
                            <motion.div
                                key="family-tree"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FamilyTreeEditor />
                            </motion.div>
                        )}

                        {activeSection === 'gallery' && (
                            <motion.div
                                key="gallery"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <GalleryEditor />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </ContentLayout>
    );
}

function StoryUploadForm() {
    const { addStory, stories, removeStory, updateStory, reorderStories, fetchStories, isLoading } = useStoryStore();

    // Fetch stories on mount
    useEffect(() => {
        fetchStories();
    }, [fetchStories]);

    const [type, setType] = useState<StoryType>('text');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Additional fields based on type
    const [author, setAuthor] = useState('');
    const [videoId, setVideoId] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isImageUploading, setIsImageUploading] = useState(false);

    // Modal State
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [alertModal, setAlertModal] = useState<{ isOpen: boolean; title: string; message: string; variant: "success" | "error" | "info" }>({
        isOpen: false, title: '', message: '', variant: 'info'
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;
    const totalPages = Math.ceil(stories.length / ITEMS_PER_PAGE);
    const paginatedStories = stories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Edit Mode State
    const [editingId, setEditingId] = useState<string | null>(null);

    // Drag and Drop State
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Drag handlers
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (toIndex: number) => {
        if (draggedIndex !== null && draggedIndex !== toIndex) {
            // Calculate actual indices considering pagination
            const actualFromIndex = (currentPage - 1) * ITEMS_PER_PAGE + draggedIndex;
            const actualToIndex = (currentPage - 1) * ITEMS_PER_PAGE + toIndex;
            reorderStories(actualFromIndex, actualToIndex);
        }
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const resetForm = () => {
        setEditingId(null);
        setType('text');
        setTitle('');
        setContent('');
        setDescription('');
        setAuthor('');
        setVideoId('');
        setImageUrl('/images/donates/card-01.png');
        setDate(new Date().toISOString().split('T')[0]);
    };

    const handleEdit = (story: typeof stories[0]) => {
        setEditingId(story.id);
        setType(story.type);
        setTitle(story.title);
        setContent(story.content);
        setDescription(story.description || '');
        setAuthor(story.author || '');
        setVideoId(story.videoId || '');
        setImageUrl(story.src || '/images/donates/card-01.png');
        setDate(story.date.replace(/\./g, '-')); // Convert YYYY.MM.DD to YYYY-MM-DD
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (type === 'image' && !imageUrl) {
            setAlertModal({ isOpen: true, title: "이미지 필요", message: "이미지를 업로드해 주세요.", variant: "error" });
            return;
        }

        if (isImageUploading) {
            setAlertModal({ isOpen: true, title: "업로드 중", message: "이미지 업로드가 완료될 때까지 기다려 주세요.", variant: "info" });
            return;
        }

        const storyData = {
            type,
            title,
            content,
            description,
            date: date.replace(/-/g, '.'),
            author: type === 'quote' ? author : undefined,
            videoId: type === 'video' ? videoId : undefined,
            src: type === 'image' ? imageUrl : undefined,
            color: type === 'text' ? 'bg-amber-50' : type === 'quote' ? 'bg-slate-800 text-white' : undefined
        };

        try {
            if (editingId !== null) {
                // Update existing story
                await updateStory(editingId, storyData);
                setAlertModal({ isOpen: true, title: "수정 완료!", message: "스토리가 성공적으로 수정되었습니다.", variant: "success" });
            } else {
                // Add new story
                await addStory(storyData);
                setAlertModal({ isOpen: true, title: "저장 완료!", message: "스토리가 성공적으로 저장되었습니다.", variant: "success" });
            }

            // Reset Form
            resetForm();
        } catch (error) {
            console.error(error);
            setAlertModal({ isOpen: true, title: "오류 발생", message: "스토리 저장에 실패했습니다. 다시 시도해 주세요.", variant: "error" });
        }
    };

    const handleDeleteConfirm = async () => {
        if (deleteTarget !== null) {
            await removeStory(deleteTarget);
            setDeleteTarget(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                title="스토리를 삭제하시겠습니까?"
                message="이 작업은 취소할 수 없습니다. 정말 이 스토리를 삭제하시겠습니까?"
                confirmText="삭제"
                cancelText="취소"
                variant="danger"
            />

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
                title={alertModal.title}
                message={alertModal.message}
                variant={alertModal.variant}
            />

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                {/* Type Selection */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { id: 'text', icon: MessageSquare, label: 'Text' },
                        { id: 'image', icon: ImageIcon, label: 'Photo' },
                        { id: 'video', icon: Video, label: 'Video' },
                        { id: 'quote', icon: Quote, label: 'Quote' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setType(item.id as StoryType)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${type === item.id
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                : 'border-stone-100 bg-stone-50 text-stone-400 hover:bg-stone-100'
                                }`}
                        >
                            <item.icon className="w-6 h-6 mb-2" />
                            <span className="text-xs font-bold uppercase">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Common Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-black"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter story title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none text-black"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Dynamic Fields */}
                <div className="space-y-4 p-6 bg-stone-50 rounded-xl border border-stone-200">
                    {/* Content / Description */}
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            {type === 'video' ? 'Description' : 'Content'}
                        </label>
                        <textarea
                            required
                            rows={type === 'quote' ? 3 : 6}
                            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none text-black"
                            value={type === 'video' ? description : content}
                            onChange={(e) => type === 'video' ? setDescription(e.target.value) : setContent(e.target.value)}
                            placeholder={type === 'video' ? "Describe the video..." : "Write your story here..."}
                        />
                    </div>

                    {type === 'quote' && (
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Author / Source</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none text-black"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                placeholder="e.g. Grandfather's Diary"
                            />
                        </div>
                    )}

                    {type === 'video' && (
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">YouTube Video URL or ID</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none font-mono text-sm text-black"
                                value={videoId}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    // Extract Video ID from various YouTube URL formats
                                    const patterns = [
                                        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
                                        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
                                        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
                                        /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
                                        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
                                    ];
                                    for (const pattern of patterns) {
                                        const match = input.match(pattern);
                                        if (match) {
                                            setVideoId(match[1]);
                                            return;
                                        }
                                    }
                                    // If no pattern matched, use the input as-is (could be a raw ID)
                                    setVideoId(input);
                                }}
                                placeholder="URL 또는 ID (예: M7lc1UVf-VE)"
                            />
                            <p className="text-xs text-stone-500 mt-1">전체 YouTube URL을 붙여넣으면 자동으로 ID가 추출됩니다.</p>

                            {/* YouTube Thumbnail Preview */}
                            {videoId && videoId.length === 11 && (
                                <div className="mt-4 relative rounded-lg overflow-hidden border border-stone-200 shadow-sm">
                                    <div className="aspect-video relative bg-stone-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                            alt="YouTube Thumbnail Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                                                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-white text-center">
                                        <span className="text-xs text-stone-500">Thumbnail Preview</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {type === 'image' && (
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Image Upload</label>
                            <ImageUploadArea value={imageUrl} onChange={setImageUrl} onProcessing={setIsImageUploading} />
                        </div>
                    )}
                </div>

                <div className="pt-4 flex gap-3">
                    {editingId !== null && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 bg-stone-200 text-stone-700 py-3 rounded-lg hover:bg-stone-300 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <X className="w-4 h-4" />
                            Cancel Edit
                        </button>
                    )}
                    <button
                        type="submit"
                        className={`${editingId !== null ? 'flex-1' : 'w-full'} bg-stone-800 text-white py-3 rounded-lg hover:bg-stone-900 transition-colors flex items-center justify-center gap-2 font-medium`}
                    >
                        <Save className="w-4 h-4" />
                        {editingId !== null ? 'Update Story' : 'Save Story'}
                    </button>
                </div>
            </form>

            {/* Edit Mode Indicator */}
            {editingId !== null && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
                    <Pencil className="w-5 h-5 text-amber-600" />
                    <span className="text-amber-800 font-medium">Editing mode: Modify the form above and click &quot;Update Story&quot; to save changes.</span>
                </div>
            )}

            {/* Existing Stories List (Mini Manager) */}
            <div className="mt-12 pt-8 border-t border-stone-200">
                <h3 className="font-serif font-bold text-lg mb-4 text-stone-700">
                    Recent Stories ({stories.length})
                    <span className="text-xs font-normal text-stone-400 ml-2">드래그하여 순서 변경</span>
                </h3>
                <div className="space-y-2">
                    {paginatedStories.map((story, index) => (
                        <div
                            key={story.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={() => handleDrop(index)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm transition-all cursor-move
                                ${editingId === story.id ? 'border-amber-400 bg-amber-50' : 'border-stone-100'}
                                ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                                ${dragOverIndex === index && draggedIndex !== index ? 'border-amber-500 border-2 bg-amber-50' : ''}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                {/* 드래그 핸들 */}
                                <div className="text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold uppercase w-12 text-stone-400">{story.type}</span>
                                <span className="text-sm font-medium text-stone-800 truncate max-w-[200px]">{story.title || story.content.slice(0, 20)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(story)}
                                    className="text-stone-400 hover:text-amber-600 p-1"
                                    title="Edit"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeleteTarget(story.id)}
                                    className="text-stone-400 hover:text-red-500 p-1"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// 이미지 미리보기 타입
interface ImagePreviewItem {
    id: string;
    dataUrl: string;
    file: File;
}

function ImageUploadArea({ value, onChange, onProcessing }: { value: string, onChange: (val: string) => void, onProcessing?: (isProcessing: boolean) => void }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isInternalProcessing, setIsInternalProcessing] = useState(false);

    const setProcessing = (processing: boolean) => {
        setIsInternalProcessing(processing);
        onProcessing?.(processing);
    };

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith('image/')) return;

        setProcessing(true);
        try {
            // Firebase Storage에 업로드
            const storageRef = ref(storage, `stories/${Date.now()}-${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(storageRef);

            onChange(downloadUrl);
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setProcessing(false);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => setIsDragging(false);

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    // 이미 선택된 이미지가 있는 경우 (이전 값 또는 업로드된 값)
    if (value && value !== '/images/donates/card-01.png') {
        return (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-stone-200 group">
                <Image src={value} alt="Preview" fill className="object-contain bg-stone-100" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 드래그 앤 드롭 영역 */}
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`
                    relative h-40 w-full rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer
                    ${isDragging ? 'border-amber-500 bg-amber-50' : 'border-stone-300 hover:border-amber-400 hover:bg-stone-50'}
                    ${isInternalProcessing ? 'pointer-events-none opacity-50' : ''}
                `}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && e.target.files[0] && handleUpload(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isInternalProcessing}
                />
                <div className="p-3 bg-white rounded-full shadow-sm">
                    {isInternalProcessing ? (
                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Upload className={`w-8 h-8 ${isDragging ? 'text-amber-500' : 'text-stone-400'}`} />
                    )}
                </div>
                <div className="text-center">
                    <p className="font-medium text-stone-700 text-sm">
                        {isInternalProcessing ? '업로드 중...' : '클릭 또는 드래그하여 업로드'}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">이미지를 선택하면 자동 저장됩니다 (최대 5MB)</p>
                </div>
            </div>
        </div>
    );
}
