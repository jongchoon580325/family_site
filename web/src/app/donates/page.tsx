"use client";

import { ContentLayout } from "@/components/layout/content-layout";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, HandHeart } from "lucide-react";

// 카드 데이터 정의
const DONATION_CARDS = [
    { id: 1, src: "/images/donates/card-01.png", alt: "시신 기증 안내", name: "안내글" },
    { id: 2, src: "/images/donates/card-02.png", alt: "기증증서 - 나기봉", name: "나기봉" },
    { id: 3, src: "/images/donates/card-03.png", alt: "기증증서 - 김필자", name: "김필자" },
    { id: 4, src: "/images/donates/card-04.png", alt: "기증증서 - 나종춘", name: "나종춘" },
    { id: 5, src: "/images/donates/card-05.png", alt: "기증증서 - 장명애", name: "장명애" },
    { id: 6, src: "/images/donates/card-06.png", alt: "기증증서 - 나한나", name: "나한나" },
    { id: 7, src: "/images/donates/card-07.png", alt: "기증증서 - 나요한", name: "나요한" },
    // 추후 등록 예정
    { id: 8, isPlaceholder: true, name: "noname" },
];

export default function DonatesPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Filter only valid image cards for the carousel
    const imageCards = DONATION_CARDS.filter(card => !card.isPlaceholder);

    const handleCardClick = (id: number, isPlaceholder: boolean) => {
        if (isPlaceholder) return;
        setSelectedId(id);
    };

    const handleClose = () => setSelectedId(null);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedId === null) return;
        const currentIndex = imageCards.findIndex(card => card.id === selectedId);
        const nextIndex = (currentIndex + 1) % imageCards.length;
        setSelectedId(imageCards[nextIndex].id);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedId === null) return;
        const currentIndex = imageCards.findIndex(card => card.id === selectedId);
        const prevIndex = (currentIndex - 1 + imageCards.length) % imageCards.length;
        setSelectedId(imageCards[prevIndex].id);
    };

    const selectedCard = imageCards.find(c => c.id === selectedId);

    return (
        <ContentLayout
            title={
                <span className="flex items-center justify-center gap-3">
                    <HandHeart className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
                    <span>
                        연세대학교 의과대학에<br className="md:hidden" /> 시신 기증을 하였습니다.
                    </span>
                </span>
            }
            description="The body was donated to Yonsei University College of Medicine."
            headerImage="/images/common/top-imgs/04-donates.png"
        >
            <div className="max-w-7xl mx-auto px-4 py-2">
                {/* Premium Section Wrapper */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Premium Background with multiple layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100/80 via-orange-50/60 to-amber-50/80 rounded-3xl -z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_50%)] rounded-3xl -z-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.1),transparent_50%)] rounded-3xl -z-10" />

                    {/* Decorative Border Frame */}
                    <div className="absolute inset-3 border-2 border-amber-300/40 rounded-2xl pointer-events-none" />
                    <div className="absolute inset-6 border border-amber-200/30 rounded-xl pointer-events-none" />

                    {/* Corner Ornaments */}
                    <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 rounded-tl-lg" />
                    <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-amber-500/50 rounded-tr-lg" />
                    <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-amber-500/50 rounded-bl-lg" />
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 rounded-br-lg" />

                    <div className="p-8 md:p-12 relative">
                        {/* Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-8">
                            {DONATION_CARDS.map((card) => (
                                <div key={card.id} className="flex flex-col gap-4">
                                    <div
                                        className="group relative aspect-[1.58/1] w-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-2 border-amber-200/50"
                                        onClick={() => handleCardClick(card.id, !!card.isPlaceholder)}
                                    >
                                        {card.isPlaceholder ? (
                                            <div className="flex h-full w-full flex-col items-center justify-center bg-secondary/5 border-2 border-dashed border-secondary/20 p-4 text-center cursor-default">
                                                <span className="font-serif text-lg font-medium text-secondary">
                                                    추후 등록 예정
                                                </span>
                                                <p className="mt-2 text-sm text-secondary/60">
                                                    (Waiting for update)
                                                </p>
                                            </div>
                                        ) : (
                                            <Image
                                                src={card.src!}
                                                alt={card.alt!}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                    </div>
                                    {/* Card Name */}
                                    <p className="text-center font-serif text-lg text-stone-700 border-t border-white/0 pt-2">
                                        {card.name}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Footer Message */}
                        <div className="mt-12 text-center">
                            <p className="font-gowun text-lg md:text-xl text-stone-700 mb-2">
                                작고 보잘 것 없는 시신기증의 은혜를 주신 <br className="md:hidden" />
                                창조주 하나님께 영광을 돌립니다.
                            </p>
                            <p className="font-gowun text-lg md:text-xl text-stone-600">
                                &quot;I ascribe glory to the Creator God for graciously enabling the donation of my body.&quot;
                            </p>
                        </div>
                    </div>
                </motion.section>
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedId !== null && selectedCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    >
                        <div
                            className="relative max-w-5xl w-full max-h-[90vh] aspect-[1.58/1]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            {/* Navigation Buttons */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-[-3rem] top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors hidden md:block"
                            >
                                <ChevronLeft className="w-10 h-10" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-[-3rem] top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors hidden md:block"
                            >
                                <ChevronRight className="w-10 h-10" />
                            </button>

                            {/* Image Container with Double White Border */}
                            {/* Outer border (padding) + Inner border (box-shadow or border) */}
                            <motion.div
                                layoutId={`card-${selectedCard.id}`}
                                className="relative h-full w-full overflow-hidden rounded-[10px] bg-white p-2 shadow-2xl"
                                style={{ boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.3)" }} // External glow/border effect
                            >
                                <div className="relative h-full w-full overflow-hidden rounded-[8px] border border-secondary/10">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={selectedCard.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative h-full w-full"
                                        >
                                            <Image
                                                src={selectedCard.src!}
                                                alt={selectedCard.alt!}
                                                fill
                                                className="object-contain bg-black"
                                                priority
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ContentLayout>
    );
}
