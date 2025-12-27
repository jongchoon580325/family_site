"use client";

import { ContentLayout } from "@/components/layout/content-layout";
import { TreeDeciduous, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useUIStore } from "@/store/ui-store";

export default function NotFound() {
    const { setSearchOpen } = useUIStore();

    return (
        <ContentLayout
            title={
                <span className="flex items-center justify-center gap-3">
                    <TreeDeciduous className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
                    Page Not Found
                </span>
            }
            description="요청하신 페이지를 찾을 수 없습니다."
            headerImage="/images/common/top-imgs/01-tree.png"
        >
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <div className="mb-8">
                    <h2 className="text-8xl font-serif font-bold text-amber-500/20 mb-4">404</h2>
                    <h3 className="text-2xl font-bold text-stone-800 mb-2">
                        길을 잃으셨나요?
                    </h3>
                    <p className="text-stone-600 leading-relaxed font-gowun">
                        죄송합니다. 요청하신 페이지가 존재하지 않거나, <br className="md:hidden" />
                        주소가 변경되었을 수 있습니다.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-100 text-stone-700 font-medium hover:bg-stone-200 hover:text-stone-900 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        홈으로 돌아가기
                    </Link>

                    <button
                        onClick={() => setSearchOpen(true)}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                        <Search className="w-4 h-4" />
                        원하는 내용 검색하기
                    </button>
                </div>

                <div className="mt-12 pt-8 border-t border-stone-100">
                    <p className="text-sm text-stone-500 mb-4">
                        혹시 아래 페이지를 찾으시나요?
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 text-sm">
                        <Link href="/tree" className="text-amber-700 hover:underline">가족 가계도</Link>
                        <span className="text-stone-300">|</span>
                        <Link href="/story" className="text-amber-700 hover:underline">가족 이야기</Link>
                        <span className="text-stone-300">|</span>
                        <Link href="/photo/nakibong-kimphilja" className="text-amber-700 hover:underline">사진 갤러리</Link>
                    </div>
                </div>
            </div>
        </ContentLayout>
    );
}
