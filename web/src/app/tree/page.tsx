'use client';

import { ContentLayout } from "@/components/layout/content-layout";
import { FamilyTree } from "@/components/family-tree/FamilyTree";
import { useFamilyTreeStore } from "@/store/family-tree-store";
import { TreeDeciduous, Globe } from "lucide-react";
import { motion } from "framer-motion";

function FamilyListCard({ parents, children, color = "stone" }: { parents: string[], children: string[], color?: "amber" | "stone" }) {
    const isAmber = color === "amber";
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`relative overflow-hidden rounded-2xl border-2 ${isAmber ? 'border-amber-200 bg-amber-50/50' : 'border-stone-200 bg-white'
                } p-6 shadow-sm hover:shadow-md transition-all duration-300`}
        >
            {/* Background Decoration */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${isAmber ? 'bg-amber-100/50' : 'bg-stone-100/50'} blur-2xl`} />

            {/* Parents Header */}
            <div className={`relative pb-4 border-b ${isAmber ? 'border-amber-200' : 'border-stone-100'} mb-4`}>
                <h3 className={`font-serif text-lg font-bold ${isAmber ? 'text-amber-900' : 'text-stone-800'} mb-3 flex items-center gap-2`}>
                    {isAmber ? '👑' : '👨‍👩‍👧‍👦'} Parents
                </h3>
                <div className="space-y-1">
                    {parents.map((parent, idx) => (
                        <p key={idx} className={`font-medium ${isAmber ? 'text-amber-800' : 'text-stone-700'}`}>
                            {idx === 0 ? 'Father' : 'Mother'} : {parent}
                        </p>
                    ))}
                </div>
            </div>

            {/* Children List */}
            <div className="relative">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isAmber ? 'text-amber-600' : 'text-stone-400'} mb-3`}>
                    Children
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {children.map((child, idx) => (
                        <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isAmber ? 'bg-amber-100/50 text-amber-900' : 'bg-stone-100/50 text-stone-700'} text-sm font-medium`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isAmber ? 'bg-amber-400' : 'bg-stone-400'}`} />
                            {child}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

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

                {/* Family List Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-16"
                >
                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-2 text-amber-700 mb-4">
                            <span className="text-2xl">❖</span>
                            <span className="text-sm font-semibold uppercase tracking-wider">Family List</span>
                        </div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-amber-900">
                            {language === 'ko' ? '가족 명단' : 'Family Member List'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* 1. Root Family */}
                        <FamilyListCard
                            parents={["나기봉 (Na, Ki Bong)", "김필자 (Kim, Phil Ja)"]}
                            children={["나종춘", "나종훈", "나종철", "나종섭", "나신숙"]}
                            color="amber"
                        />
                        {/* 2. 1st Son Family */}
                        <FamilyListCard
                            parents={["나종춘 (Na, Jong Choon)", "장명애 (Jang, Myung Eai)"]}
                            children={["나한나", "나요한"]}
                            color="stone"
                        />
                        {/* 3. 3rd Son Family */}
                        <FamilyListCard
                            parents={["나종섭 (Na, Jong Seob)", "김양진 (Kim, Yang Jin)"]}
                            children={["나경찬", "나경훈"]}
                            color="stone"
                        />
                        {/* 4. Daughter Family */}
                        <FamilyListCard
                            parents={["김진수 (Kim, Jin Soo)", "나신숙 (Na, Shin Sook)"]}
                            children={["김시후"]}
                            color="stone"
                        />
                        {/* 5. Granddaughter Family */}
                        <FamilyListCard
                            parents={["정기원 (Jung, Ki Won)", "나한나 (Na, Han Na)"]}
                            children={["정하윤"]}
                            color="stone"
                        />
                        {/* 6. Grandson Family */}
                        <FamilyListCard
                            parents={["나요한 (Na, Yo Han)", "형정순 (Hyung, Jung Soon)"]}
                            children={["나서현"]}
                            color="stone"
                        />
                    </div>
                </motion.section>
            </div>
        </ContentLayout>
    );
}
