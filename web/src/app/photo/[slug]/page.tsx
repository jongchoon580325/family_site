'use client';

import { ContentLayout } from "@/components/layout/content-layout";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { GalleryCategory } from "@/types/gallery";
import { useParams } from "next/navigation";
import { Camera } from "lucide-react";

// Define the data for each gallery page
const GALLERY_DATA: Record<string, {
    title: string;
    titleKo: string;
    description: string;
    image: string;
    category: GalleryCategory;
}> = {
    "nakibong-kimphilja": {
        title: "Photo Gallery",
        titleKo: "나기봉.김필자",
        description: "소중한 추억을 함께 나눕니다",
        image: "/images/common/top-imgs/06-01-nakibong.png",
        category: "nakibong-kimphilja",
    },
    "najongchoon-jangmyeongae": {
        title: "Photo Gallery",
        titleKo: "나종춘.장명애",
        description: "소중한 추억을 함께 나눕니다",
        image: "/images/common/top-imgs/06-02-najongchoon.png",
        category: "najongchoon-jangmyungaei",
    },
    "najongseob-kimyangjin": {
        title: "Photo Gallery",
        titleKo: "나종섭.김양진",
        description: "소중한 추억을 함께 나눕니다",
        image: "/images/common/top-imgs/06-03-najongseob.png",
        category: "najongseop-kimyangjin",
    },
    "nashinsook-kimjinsu": {
        title: "Photo Gallery",
        titleKo: "나신숙.김진수",
        description: "소중한 추억을 함께 나눕니다",
        image: "/images/common/top-imgs/06-04-nashinsook.png",
        category: "nashinsuk-kimjinsu",
    },
    "nahanna-jeongkiwon": {
        title: "Photo Gallery",
        titleKo: "나한나.정기원",
        description: "소중한 추억을 함께 나눕니다",
        image: "/images/common/top-imgs/06-05-nahanna.png",
        category: "nahanna-jungkiwon",
    },
    "nayohan-hyeongjeongsun": {
        title: "Photo Gallery",
        titleKo: "나요한.형정순",
        description: "소중한 추억을 함께 나눕니다",
        image: "/images/common/top-imgs/06-06-nayohan.png",
        category: "nayohan-hyungjungsoon",
    },
};

export default function PhotoPage() {
    const params = useParams();
    const slug = params.slug as string;
    const data = GALLERY_DATA[slug];

    if (!data) {
        return (
            <ContentLayout
                title="Page Not Found"
                headerImage="/images/common/top-imgs/01-tree.png"
            >
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-stone-600">요청하신 페이지를 찾을 수 없습니다.</p>
                </div>
            </ContentLayout>
        );
    }

    return (
        <ContentLayout
            title={
                <span className="flex items-center justify-center gap-3">
                    <Camera className="w-8 h-8 md:w-10 md:h-10 opacity-80" />
                    {data.title}
                </span>
            }
            description={data.titleKo}
            headerImage={data.image}
        >
            <div className="max-w-7xl mx-auto px-4 py-6">
                <PhotoGallery
                    category={data.category}
                    title={data.titleKo}
                    description={data.description}
                />
            </div>
        </ContentLayout>
    );
}
