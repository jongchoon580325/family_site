'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useGalleryStore } from '@/store/gallery-store';
import { GalleryCategory, GalleryImage as GalleryImageType } from '@/types/gallery';
import { X, ChevronLeft, ChevronRight, ZoomIn, ArrowUp } from 'lucide-react';

interface PhotoGalleryProps {
    category: GalleryCategory;
    title: string;
    description?: string;
}

// 물결 리플 효과를 위한 CSS 키프레임
const rippleAnimation = `
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 0.5;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

// 개별 갤러리 이미지 컴포넌트 (Parallax + Ripple)
function GalleryImageCard({
    image,
    index,
    onClick
}: {
    image: GalleryImageType;
    index: number;
    onClick: () => void;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    // Parallax 3D 기울기 효과
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 15, y: -x * 15 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setRipple({ ...ripple, show: false });
    };

    // 물결 리플 효과
    const handleMouseEnter = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setRipple({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            show: true,
        });
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
            style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.15s ease-out',
            }}
        >
            {/* 이미지 */}
            <Image
                src={image.src}
                alt={image.title || '갤러리 이미지'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                unoptimized={image.src.startsWith('data:')}
            />

            {/* 프리미엄 테두리 */}
            <div className="absolute inset-0 border-2 border-amber-300/40 rounded-xl pointer-events-none group-hover:border-amber-400/60 transition-colors" />

            {/* 물결 리플 효과 */}
            {ripple.show && (
                <span
                    className="absolute rounded-full bg-white/30 pointer-events-none"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 50,
                        height: 50,
                        marginLeft: -25,
                        marginTop: -25,
                        animation: 'ripple 0.8s ease-out forwards',
                    }}
                />
            )}

            {/* 호버 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* 확대 아이콘 */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* 제목 */}
            {image.title && (
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-sm font-medium">{image.title}</span>
                </div>
            )}
        </motion.div>
    );
}

// Lightbox 모달 컴포넌트
function Lightbox({
    images,
    currentIndex,
    onClose,
    onPrev,
    onNext,
}: {
    images: GalleryImageType[];
    currentIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}) {
    const currentImage = images[currentIndex];

    // 키보드 네비게이션
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onPrev, onNext]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={onClose}
        >
            {/* 닫기 버튼 */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
                <X className="w-6 h-6" />
            </button>

            {/* 이전 버튼 */}
            <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            {/* 다음 버튼 */}
            <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* 이미지 */}
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-5xl max-h-[85vh] mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={currentImage.src}
                    alt={currentImage.title || '갤러리 이미지'}
                    width={1200}
                    height={800}
                    className="rounded-lg object-contain max-h-[85vh]"
                    unoptimized={currentImage.src.startsWith('data:')}
                />

                {/* 이미지 정보 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                    <p className="text-white font-medium">{currentImage.title}</p>
                    <p className="text-white/60 text-sm">{currentIndex + 1} / {images.length}</p>
                </div>
            </motion.div>
        </motion.div>
    );
}

// 위로가기 버튼 컴포넌트
function ScrollToTop() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 200);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 w-12 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
                    title="맨 위로"
                >
                    <ArrowUp className="w-5 h-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

// 메인 PhotoGallery 컴포넌트
export function PhotoGallery({ category, title, description }: PhotoGalleryProps) {
    const { getImagesByCategory, visibleCount, loadMore, resetVisibleCount, fetchImages, isLoading } = useGalleryStore();
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // 클라이언트 마운트 확인 (Hydration 오류 방지)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Firebase에서 이미지 로드
    useEffect(() => {
        if (isMounted) {
            fetchImages();
        }
    }, [isMounted, fetchImages]);

    const allImages = isMounted ? getImagesByCategory(category) : [];
    const visibleImages = allImages.slice(0, visibleCount);
    const hasMore = visibleCount < allImages.length;

    // 컴포넌트 마운트 시 visible count 리셋
    useEffect(() => {
        if (isMounted) {
            resetVisibleCount();
        }
    }, [category, resetVisibleCount, isMounted]);

    // 리플 애니메이션 CSS 동적 삽입
    useEffect(() => {
        const styleId = 'ripple-animation-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = rippleAnimation;
            document.head.appendChild(style);
        }
        return () => {
            // cleanup은 하지 않음 (다른 컴포넌트에서도 사용할 수 있으므로)
        };
    }, []);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const prevImage = () => setLightboxIndex(prev =>
        prev !== null ? (prev - 1 + allImages.length) % allImages.length : null
    );
    const nextImage = () => setLightboxIndex(prev =>
        prev !== null ? (prev + 1) % allImages.length : null
    );

    return (
        <>
            {/* 프리미엄 섹션 래퍼 */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
            >
                {/* 프리미엄 배경 */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-orange-50/60 to-amber-50/80 rounded-3xl -z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_50%)] rounded-3xl -z-10" />

                {/* 테두리 프레임 */}
                <div className="absolute inset-3 border-2 border-amber-300/40 rounded-2xl pointer-events-none" />
                <div className="absolute inset-6 border border-amber-200/30 rounded-xl pointer-events-none" />

                {/* 코너 장식 */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg" />

                <div className="p-8 md:p-12 relative">
                    {/* 섹션 헤더 */}
                    <div className="text-center mb-8">
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-amber-800 mb-2">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-stone-600 font-gowun">{description}</p>
                        )}
                    </div>

                    {/* Masonry 그리드 */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {visibleImages.map((image, index) => (
                            <GalleryImageCard
                                key={image.id}
                                image={image}
                                index={index}
                                onClick={() => openLightbox(index)}
                            />
                        ))}
                    </div>

                    {/* 더 보기 버튼 */}
                    {hasMore && (
                        <div className="text-center mt-8">
                            <button
                                onClick={loadMore}
                                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium shadow-lg transition-colors"
                            >
                                더 보기 ({visibleCount} / {allImages.length}장)
                            </button>
                        </div>
                    )}

                    {/* 이미지 없을 때 */}
                    {allImages.length === 0 && (
                        <div className="text-center py-16 text-stone-500">
                            <p className="text-lg">등록된 사진이 없습니다.</p>
                            <p className="text-sm mt-2">Manager에서 사진을 업로드해주세요.</p>
                        </div>
                    )}
                </div>
            </motion.section>

            {/* Lightbox 모달 */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <Lightbox
                        images={allImages}
                        currentIndex={lightboxIndex}
                        onClose={closeLightbox}
                        onPrev={prevImage}
                        onNext={nextImage}
                    />
                )}
            </AnimatePresence>

            {/* 위로가기 버튼 */}
            <ScrollToTop />
        </>
    );
}

export default PhotoGallery;
