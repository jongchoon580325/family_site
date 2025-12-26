'use client';

import { ContentLayout } from "@/components/layout/content-layout";
import { FamilyTree } from "@/components/family-tree/FamilyTree";
import { useFamilyTreeStore } from "@/store/family-tree-store";
import { TreeDeciduous, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function TreePage() {
    const { data, language, setLanguage } = useFamilyTreeStore();

    return (
        <ContentLayout
            title={
                <span className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3">
                    <TreeDeciduous className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
                    <span>우리집 가계도</span>
                    <span className="text-lg md:text-4xl font-normal md:font-bold">(Family Tree)</span>
                </span>
            }
            description="창조주 하나님을 섬기는 우리 가족 현황입니다."
            headerImage="/images/common/top-imgs/01-tree.png"
        >
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Language Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 bg-white rounded-full p-1 shadow-md border border-amber-200">
                        <button
                            onClick={() => setLanguage('ko')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${language === 'ko'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-stone-600 hover:bg-amber-50'
                                }`}
                        >
                            <Globe className="w-4 h-4" />
                            한국어
                        </button>
                        <button
                            onClick={() => setLanguage('en')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${language === 'en'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-stone-600 hover:bg-amber-50'
                                }`}
                        >
                            <Globe className="w-4 h-4" />
                            English
                        </button>
                    </div>
                </motion.div>

                {/* Family Tree Section with Premium Border */}
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
                        {/* Section Header */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center gap-2 text-amber-700 mb-4">
                                <TreeDeciduous className="w-6 h-6" />
                                <span className="text-sm font-semibold uppercase tracking-wider">Family Tree</span>
                            </div>
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-amber-800 mb-2">
                                {language === 'ko' ? '우리 가족 가계도' : 'Our Family Tree'}
                            </h2>
                            <p className="text-stone-600 font-gowun">
                                {language === 'ko'
                                    ? '하나님 아버지로부터 시작된 우리 가족의 계보입니다'
                                    : 'Our family lineage starting from God Father'}
                            </p>
                        </div>

                        {/* Family Tree Visualization */}
                        <div className="bg-stone-900/95 rounded-2xl p-6 shadow-inner overflow-x-auto">
                            <FamilyTree root={data.root} language={language} />
                        </div>

                        {/* Legend */}
                        <div className="flex justify-center gap-8 mt-6 text-sm text-stone-600">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-pink-300 border-2 border-pink-400" />
                                <span>{language === 'ko' ? '가족 구성원' : 'Family Member'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-teal-300" />
                                <span>{language === 'ko' ? '혈연 관계' : 'Family Connection'}</span>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </div>
        </ContentLayout>
    );
}
