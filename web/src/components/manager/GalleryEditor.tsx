'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useGalleryStore } from '@/store/gallery-store';
import { GalleryCategory, GALLERY_CATEGORIES, GalleryImage } from '@/types/gallery';
import Image from 'next/image';
import {
    Upload,
    Trash2,
    Save,
    X,
    FolderOpen,
    Plus,
    Images,
    CheckCircle,
    Loader2
} from 'lucide-react';

// localStorage 용량 체크 유틸
const getStorageUsage = (): { used: number; total: number; percentage: number } => {
    let used = 0;
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            used += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
        }
    }
    const total = 5 * 1024 * 1024; // 약 5MB (브라우저별 다름)
    return { used, total, percentage: Math.round((used / total) * 100) };
};

// 이미지 압축 유틸 함수 (강력한 압축 적용)
const compressImage = (file: File, maxWidth: number = 600): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scaleSize = maxWidth / img.width;
                const width = img.width > maxWidth ? maxWidth : img.width;
                const height = img.width > maxWidth ? img.height * scaleSize : img.height;

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // JPEG 0.5 quality로 강력 압축 (용량 절약)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
                resolve(dataUrl);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

// 다중 파일 업로드 미리보기 타입
interface UploadPreview {
    id: string;
    file: File;
    preview: string;
    title: string;
    status: 'pending' | 'processing' | 'done' | 'error';
}

export function GalleryEditor() {
    const { addImage, removeImage, getImagesByCategory, reorderImages, fetchImages, isLoading, images } = useGalleryStore();
    const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('nakibong-kimphilja');
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploadPreviews, setUploadPreviews] = useState<UploadPreview[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [storageUsage, setStorageUsage] = useState({ used: 0, total: 5 * 1024 * 1024, percentage: 0 });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 이미지 순서 변경을 위한 드래그 상태
    const [imageDragIndex, setImageDragIndex] = useState<number | null>(null);
    const [imageDragOverIndex, setImageDragOverIndex] = useState<number | null>(null);

    const categoryImages = getImagesByCategory(selectedCategory);
    const selectedCategoryInfo = GALLERY_CATEGORIES.find(c => c.id === selectedCategory);

    // Firebase에서 이미지 로드
    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    // 저장소 용량 업데이트 (Firebase에서는 불필요하지만 UI 유지)
    useEffect(() => {
        setStorageUsage(getStorageUsage());
    }, [images]);

    // 이미지 드래그 앤 드롭 핸들러
    const handleImageDragStart = (index: number) => {
        setImageDragIndex(index);
    };

    const handleImageDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setImageDragOverIndex(index);
    };

    const handleImageDragLeave = () => {
        setImageDragOverIndex(null);
    };

    const handleImageDrop = (toIndex: number) => {
        if (imageDragIndex !== null && imageDragIndex !== toIndex) {
            // 새 순서로 이미지 ID 배열 생성
            const newOrder = [...categoryImages];
            const [movedItem] = newOrder.splice(imageDragIndex, 1);
            newOrder.splice(toIndex, 0, movedItem);
            reorderImages(selectedCategory, newOrder.map(img => img.id));
        }
        setImageDragIndex(null);
        setImageDragOverIndex(null);
    };

    const handleImageDragEnd = () => {
        setImageDragIndex(null);
        setImageDragOverIndex(null);
    };

    // 다중 파일 선택 핸들러
    const handleFilesSelect = useCallback(async (files: FileList | File[]) => {
        const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));

        if (fileArray.length === 0) return;

        // 미리보기 생성
        const newPreviews: UploadPreview[] = await Promise.all(
            fileArray.map(async (file) => ({
                id: `preview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                file,
                preview: URL.createObjectURL(file),
                title: file.name.replace(/\.[^/.]+$/, ''), // 확장자 제거
                status: 'pending' as const,
            }))
        );

        setUploadPreviews(prev => [...prev, ...newPreviews]);
    }, []);

    // 파일 입력 변경
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFilesSelect(e.target.files);
            e.target.value = ''; // 리셋
        }
    };

    // 드래그 앤 드롭
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleFilesSelect(e.dataTransfer.files);
        }
    };

    // 미리보기 제목 수정
    const updatePreviewTitle = (id: string, title: string) => {
        setUploadPreviews(prev =>
            prev.map(p => p.id === id ? { ...p, title } : p)
        );
    };

    // 미리보기 삭제
    const removePreview = (id: string) => {
        setUploadPreviews(prev => {
            const item = prev.find(p => p.id === id);
            if (item) URL.revokeObjectURL(item.preview);
            return prev.filter(p => p.id !== id);
        });
    };

    // 전체 업로드 실행
    const handleUploadAll = async () => {
        if (uploadPreviews.length === 0) return;

        setIsProcessing(true);
        setErrorMessage(null);

        let successCount = 0;
        let failedDueToQuota = false;

        for (let i = 0; i < uploadPreviews.length; i++) {
            const preview = uploadPreviews[i];

            // 이미 용량 초과된 경우 남은 파일 스킵
            if (failedDueToQuota) {
                setUploadPreviews(prev =>
                    prev.map(p => p.id === preview.id ? { ...p, status: 'error' } : p)
                );
                continue;
            }

            // 상태 업데이트: 처리 중
            setUploadPreviews(prev =>
                prev.map(p => p.id === preview.id ? { ...p, status: 'processing' } : p)
            );

            try {
                // Firebase Storage에 업로드 (addImage가 파일 처리)
                await addImage({
                    category: selectedCategory,
                    src: '', // Firebase Storage에서 URL이 생성됨
                    title: preview.title || undefined,
                    order: categoryImages.length + i,
                }, preview.file);

                // 상태 업데이트: 완료
                setUploadPreviews(prev =>
                    prev.map(p => p.id === preview.id ? { ...p, status: 'done' } : p)
                );
                successCount++;
            } catch (error) {
                console.error('Image upload failed:', error);
                setUploadPreviews(prev =>
                    prev.map(p => p.id === preview.id ? { ...p, status: 'error' } : p)
                );
            }
        }

        setIsProcessing(false);
        setStorageUsage(getStorageUsage());

        if (successCount > 0) {
            // 성공한 항목 정리 (1초 후)
            setTimeout(() => {
                setUploadPreviews(prev => {
                    prev.forEach(p => {
                        if (p.status === 'done') URL.revokeObjectURL(p.preview);
                    });
                    return prev.filter(p => p.status !== 'done');
                });
            }, 1000);
        }
    };

    // 업로드 폼 닫기
    const closeUploadForm = () => {
        uploadPreviews.forEach(p => URL.revokeObjectURL(p.preview));
        setUploadPreviews([]);
        setShowUploadForm(false);
    };

    const handleDelete = (id: string) => {
        removeImage(id);
        setShowDeleteConfirm(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-800">Gallery Editor</h2>
                    <p className="text-sm text-stone-500 mt-1">카테고리별로 사진을 관리할 수 있습니다.</p>
                </div>
            </div>

            {/* Storage Usage Indicator */}
            <div className="bg-stone-50 rounded-lg p-3 border border-stone-200">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-stone-600">저장소 사용량</span>
                    <span className={`font-medium ${storageUsage.percentage > 80 ? 'text-red-600' : 'text-stone-700'}`}>
                        {(storageUsage.used / (1024 * 1024)).toFixed(2)} MB / {(storageUsage.total / (1024 * 1024)).toFixed(0)} MB ({storageUsage.percentage}%)
                    </span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all ${storageUsage.percentage > 80 ? 'bg-red-500' :
                            storageUsage.percentage > 60 ? 'bg-amber-500' : 'bg-green-500'
                            }`}
                        style={{ width: `${Math.min(storageUsage.percentage, 100)}%` }}
                    />
                </div>
                {storageUsage.percentage > 80 && (
                    <p className="text-xs text-red-600 mt-2">⚠️ 저장소가 거의 가득 찼습니다! 기존 이미지를 삭제해주세요.</p>
                )}
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                        <button
                            onClick={() => setErrorMessage(null)}
                            className="text-xs text-red-600 hover:text-red-800 mt-1"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* Category Selector */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                <h3 className="font-semibold text-stone-700 mb-3 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    카테고리 선택
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {GALLERY_CATEGORIES.map((cat) => {
                        const count = getImagesByCategory(cat.id).length;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-3 rounded-lg text-left transition-colors ${selectedCategory === cat.id
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-amber-50'
                                    }`}
                            >
                                <span className="block font-medium text-sm">{cat.nameKo}</span>
                                <span className="block text-xs opacity-75 mt-1">{count}장</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Image Grid */}
            <div className="bg-white rounded-xl p-4 border border-stone-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-stone-700">
                        {selectedCategoryInfo?.nameKo} 사진 목록 ({categoryImages.length}장)
                    </h3>
                    <button
                        onClick={() => setShowUploadForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        사진 추가
                    </button>
                </div>

                {/* 다중 파일 업로드 폼 */}
                {showUploadForm && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-amber-800 flex items-center gap-2">
                                <Images className="w-4 h-4" />
                                다중 사진 업로드
                            </h4>
                            <button
                                onClick={closeUploadForm}
                                className="p-1 text-stone-400 hover:text-stone-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 드래그 앤 드롭 영역 */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`
                                relative h-32 w-full rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 cursor-pointer
                                ${isDragging ? 'border-amber-500 bg-amber-100' : 'border-stone-300 hover:border-amber-400 hover:bg-white'}
                            `}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileInputChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className={`w-8 h-8 ${isDragging ? 'text-amber-500' : 'text-stone-400'}`} />
                            <p className="text-sm text-stone-600">
                                <span className="font-medium text-amber-600">클릭</span> 또는 <span className="font-medium">여러 파일 드래그</span>
                            </p>
                            <p className="text-xs text-stone-400">PNG, JPG, GIF (최대 5MB/파일)</p>
                        </div>

                        {/* 업로드 미리보기 목록 */}
                        {uploadPreviews.length > 0 && (
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-stone-700">
                                        {uploadPreviews.length}개 파일 선택됨
                                    </span>
                                    <button
                                        onClick={() => {
                                            uploadPreviews.forEach(p => URL.revokeObjectURL(p.preview));
                                            setUploadPreviews([]);
                                        }}
                                        className="text-xs text-stone-500 hover:text-red-500"
                                    >
                                        전체 삭제
                                    </button>
                                </div>

                                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                                    {uploadPreviews.map((preview) => (
                                        <div
                                            key={preview.id}
                                            className={`flex items-center gap-3 p-2 bg-white rounded-lg border ${preview.status === 'done' ? 'border-green-300 bg-green-50' :
                                                preview.status === 'error' ? 'border-red-300 bg-red-50' :
                                                    preview.status === 'processing' ? 'border-amber-300 bg-amber-50' :
                                                        'border-stone-200'
                                                }`}
                                        >
                                            {/* 썸네일 */}
                                            <div className="w-12 h-12 relative flex-shrink-0 rounded overflow-hidden bg-stone-100">
                                                <Image
                                                    src={preview.preview}
                                                    alt={preview.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* 제목 입력 */}
                                            <input
                                                type="text"
                                                value={preview.title}
                                                onChange={(e) => updatePreviewTitle(preview.id, e.target.value)}
                                                placeholder="제목 입력"
                                                disabled={preview.status !== 'pending'}
                                                className="flex-1 px-2 py-1 text-sm border border-stone-200 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-stone-100"
                                            />

                                            {/* 상태 아이콘 */}
                                            {preview.status === 'processing' && (
                                                <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                                            )}
                                            {preview.status === 'done' && (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            )}
                                            {preview.status === 'error' && (
                                                <X className="w-5 h-5 text-red-500" />
                                            )}
                                            {preview.status === 'pending' && (
                                                <button
                                                    onClick={() => removePreview(preview.id)}
                                                    className="p-1 text-stone-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* 업로드 버튼 */}
                                <button
                                    onClick={handleUploadAll}
                                    disabled={isProcessing || uploadPreviews.every(p => p.status !== 'pending')}
                                    className="w-full py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            업로드 중...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            {uploadPreviews.filter(p => p.status === 'pending').length}개 파일 업로드
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Image List */}
                {categoryImages.length > 0 ? (
                    <>
                        <p className="text-xs text-stone-400 mb-2">📌 드래그하여 순서 변경</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {categoryImages.map((img, index) => (
                                <div
                                    key={img.id}
                                    draggable
                                    onDragStart={() => handleImageDragStart(index)}
                                    onDragOver={(e) => handleImageDragOver(e, index)}
                                    onDragLeave={handleImageDragLeave}
                                    onDrop={() => handleImageDrop(index)}
                                    onDragEnd={handleImageDragEnd}
                                    className={`relative group aspect-square bg-stone-100 rounded-lg overflow-hidden border-2 transition-all cursor-move
                                        ${imageDragIndex === index ? 'opacity-50 scale-95' : ''}
                                        ${imageDragOverIndex === index && imageDragIndex !== index ? 'border-amber-500 border-4 scale-105' : 'border-stone-200'}
                                    `}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.title || '갤러리 이미지'}
                                        fill
                                        className="object-cover pointer-events-none"
                                        unoptimized={img.src.startsWith('data:')}
                                    />

                                    {/* 순서 번호 */}
                                    <div className="absolute top-2 left-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {index + 1}
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setShowDeleteConfirm(img.id)}
                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Title */}
                                    {img.title && (
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                            <span className="text-white text-xs truncate block">{img.title}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12 text-stone-500">
                        <p>등록된 사진이 없습니다.</p>
                        <p className="text-sm mt-1">위의 &quot;사진 추가&quot; 버튼을 클릭하여 사진을 추가해주세요.</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
                        <h3 className="text-lg font-bold text-stone-800 mb-2">삭제 확인</h3>
                        <p className="text-sm text-stone-600 mb-4">
                            이 사진을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GalleryEditor;
