"use client";

import { ContentLayout } from "@/components/layout/content-layout";
import { Music, Quote, BookOpen, Award, Heart, Palette, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Artwork data
const ARTWORKS = [
    { id: 1, src: "/images/mom/mom-art-01.jpg", title: "작품 01" },
    { id: 2, src: "/images/mom/mom-art-02.jpg", title: "작품 02" },
    { id: 3, src: "/images/mom/mom-art-03.jpg", title: "작품 03" },
    { id: 4, src: "/images/mom/mom-art-04.jpg", title: "작품 04" },
    { id: 5, src: "/images/mom/mom-art-05.jpg", title: "작품 05" },
    { id: 6, src: "/images/mom/mom-art-06.jpg", title: "작품 06" },
    { id: 7, src: "/images/mom/mom-art-07.jpg", title: "작품 07" },
    { id: 8, src: "/images/mom/mom-art-08.jpg", title: "작품 08" },
    { id: 9, src: "/images/mom/mom-art-09.jpg", title: "작품 09" },
    { id: 10, src: "/images/mom/mom-art-10.jpg", title: "작품 10" },
    { id: 11, src: "/images/mom/mom-art-11.jpg", title: "작품 11" },
    { id: 12, src: "/images/mom/mom-art-12.jpg", title: "작품 12" },
    { id: 13, src: "/images/mom/mom-art-13.jpg", title: "작품 13" },
    { id: 14, src: "/images/mom/mom-art-14.jpg", title: "작품 14" },
];

export default function MomPage() {
    const [selectedArtwork, setSelectedArtwork] = useState<number | null>(null);

    const handlePrev = () => {
        if (selectedArtwork === null) return;
        const currentIndex = ARTWORKS.findIndex(a => a.id === selectedArtwork);
        const prevIndex = (currentIndex - 1 + ARTWORKS.length) % ARTWORKS.length;
        setSelectedArtwork(ARTWORKS[prevIndex].id);
    };

    const handleNext = () => {
        if (selectedArtwork === null) return;
        const currentIndex = ARTWORKS.findIndex(a => a.id === selectedArtwork);
        const nextIndex = (currentIndex + 1) % ARTWORKS.length;
        setSelectedArtwork(ARTWORKS[nextIndex].id);
    };

    const currentArtwork = ARTWORKS.find(a => a.id === selectedArtwork);

    return (
        <ContentLayout
            title={
                <span className="flex items-center justify-center gap-3">
                    <Music className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
                    찬송의 능력으로 이기셨습니다.
                </span>
            }
            description="Mother won through the power of praise."
            headerImage="/images/common/top-imgs/02-mom.png"
        >
            <div className="max-w-6xl mx-auto space-y-20">

                {/* Hymn Quote Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
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

                    <div className="p-10 md:p-16 text-center relative">
                        {/* Decorative Quote Icon with glow */}
                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 blur-xl bg-amber-300/30 rounded-full scale-150" />
                            <Quote className="relative w-14 h-14 text-amber-500" />
                        </div>

                        {/* Korean Hymn */}
                        <p className="font-gowun text-xl md:text-2xl text-stone-800 leading-relaxed mb-4">
                            &quot;나 같은 죄인 살리신 주 은혜 놀라워<br className="hidden md:block" />
                            잃었던 생명 찾았고 광명을 얻었네.<br className="hidden md:block" />
                            큰 죄악에서 건지신 주 은혜 고마워<br className="hidden md:block" />
                            나 처음 믿은 그 시간 귀하고 귀하다&quot;
                        </p>

                        <p className="text-amber-700 text-sm font-medium mb-8">- 찬송가 305장 -</p>

                        {/* Decorative Divider */}
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                            <div className="w-2 h-2 bg-amber-400 rounded-full" />
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                        </div>

                        {/* English Hymn */}
                        <p className="font-serif text-lg md:text-xl text-stone-600 italic leading-relaxed">
                            &quot;Amazing grace! how sweet the sound,<br />
                            That saved a wretch like me!<br />
                            I once was lost, but now am found,<br />
                            Was blind, but now I see.&quot;
                        </p>
                    </div>
                </motion.section>

                {/* Book Showcase Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                    {/* Book Cover Image */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 via-orange-200 to-amber-200 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                        <div className="relative bg-white p-4 rounded-2xl shadow-2xl">
                            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
                                <Image
                                    src="/images/common/mom_book_cover.png"
                                    alt="김필자 여사님의 재활 그림책"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <p className="text-center text-sm text-stone-500 mt-4 font-gowun">
                                김필자 여사님의 재활 그림 모음집
                            </p>
                        </div>
                    </div>

                    {/* Story Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 text-amber-700 mb-4">
                                <BookOpen className="w-5 h-5" />
                                <span className="text-sm font-semibold uppercase tracking-wider">그림의 이야기</span>
                            </div>
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-800 mb-6 leading-tight">
                                붓으로 다시 일어선<br />
                                <span className="text-amber-700">어머니의 기적</span>
                            </h2>
                        </div>

                        <div className="space-y-6 text-stone-600 leading-relaxed font-gowun">
                            <p>
                                2010년, 김필자 여사님께서 뇌경색 진단을 받으셨습니다.
                                병원 치료 후 퇴원하셔서 집으로 돌아오시면서,
                                스스로 재활 치료 운동과 함께 그림을 그리기 시작하셨습니다.
                            </p>
                            <p>
                                한 획 한 획, 떨리는 손으로 그려낸 그림들이 모여
                                한 권의 책으로 발간되었습니다.
                            </p>
                        </div>

                        {/* Achievement Card */}
                        <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl p-6 text-white">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-amber-500/20 rounded-xl">
                                    <Award className="w-8 h-8 text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">미술재활치료 모범사례 선정</h3>
                                    <p className="text-stone-300 text-sm leading-relaxed">
                                        이 책은 수원대학교 미술대학 최필규 교수에게 헌정되었고,
                                        미술재활치료의 모범사례로 학과에서 선정되었습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* English Description */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
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

                    <div className="p-10 md:p-14 relative">
                        <div className="flex items-center gap-2 text-amber-700 mb-6">
                            <Heart className="w-5 h-5" />
                            <span className="text-sm font-semibold uppercase tracking-wider">English</span>
                        </div>
                        <p className="text-stone-700 leading-relaxed text-lg">
                            This painting was published in a book by Mrs. Phil-ja Kim in 2010,
                            after being diagnosed with cerebral infarction. After being discharged
                            from the hospital and returning home, some of the drawings she drew
                            along with her rehabilitation exercises were collected and published.
                            Afterwards, it was dedicated to Professor Choi Pil-gyu of the College
                            of Fine Arts at Suwon University, and was selected by the department
                            as an exemplary case of art rehabilitation therapy.
                        </p>
                    </div>
                </motion.section>

                {/* Art Gallery Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
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

                    <div className="p-10 md:p-14 space-y-8 relative">
                        {/* Section Header */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-amber-700 mb-4">
                                <Palette className="w-6 h-6" />
                                <span className="text-sm font-semibold uppercase tracking-wider">Art Gallery</span>
                            </div>
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-amber-800 mb-4">
                                어머니의 작품들
                            </h2>
                            <p className="text-stone-600 font-gowun">
                                클릭하여 작품을 크게 감상하세요
                            </p>
                        </div>

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {ARTWORKS.map((artwork, index) => (
                                <motion.div
                                    key={artwork.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    onClick={() => setSelectedArtwork(artwork.id)}
                                    className="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 border-2 border-amber-200/50"
                                >
                                    <Image
                                        src={artwork.src}
                                        alt={artwork.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="text-sm font-medium">{artwork.title}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>

            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedArtwork !== null && currentArtwork && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                        onClick={() => setSelectedArtwork(null)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedArtwork(null)}
                            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Navigation - Previous */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        {/* Navigation - Next */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        {/* Image Container */}
                        <motion.div
                            key={currentArtwork.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-[90vw] h-[80vh] max-w-5xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={currentArtwork.src}
                                alt={currentArtwork.title}
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>

                        {/* Caption */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white">
                            <p className="text-lg font-medium">{currentArtwork.title}</p>
                            <p className="text-sm text-white/60 mt-1">
                                {ARTWORKS.findIndex(a => a.id === selectedArtwork) + 1} / {ARTWORKS.length}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ContentLayout>
    );
}
