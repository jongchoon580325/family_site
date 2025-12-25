/**
 * Photo Gallery Type Definitions
 * 포토 갤러리 데이터 구조를 위한 TypeScript 타입 정의
 */

/**
 * 갤러리 카테고리 (가족별)
 */
export type GalleryCategory =
    | 'nakibong-kimphilja'      // 나기봉.김필자
    | 'najongchoon-jangmyungaei' // 나종춘.장명애
    | 'najongseop-kimyangjin'   // 나종섭.김양진
    | 'nashinsuk-kimjinsu'      // 나신숙.김진수
    | 'nahanna-jungkiwon'       // 나한나.정기원
    | 'nayohan-hyungjungsoon';  // 나요한.형정순

/**
 * 카테고리 정보
 */
export interface CategoryInfo {
    id: GalleryCategory;
    nameKo: string;
    nameEn: string;
    path: string;
}

/**
 * 갤러리 카테고리 목록
 */
export const GALLERY_CATEGORIES: CategoryInfo[] = [
    { id: 'nakibong-kimphilja', nameKo: '나기봉.김필자', nameEn: 'Na Gi-bong & Kim Phil-ja', path: '/photo/nakibong-kimphilja' },
    { id: 'najongchoon-jangmyungaei', nameKo: '나종춘.장명애', nameEn: 'Na Jong-choon & Jang Myeong-aei', path: '/photo/najongchoon-jangmyungaei' },
    { id: 'najongseop-kimyangjin', nameKo: '나종섭.김양진', nameEn: 'Na Jong-seop & Kim Yang-jin', path: '/photo/najongseop-kimyangjin' },
    { id: 'nashinsuk-kimjinsu', nameKo: '나신숙.김진수', nameEn: 'Na Shin-suk & Kim Jin-su', path: '/photo/nashinsuk-kimjinsu' },
    { id: 'nahanna-jungkiwon', nameKo: '나한나.정기원', nameEn: 'Na Han-na & Jung Gi-won', path: '/photo/nahanna-jungkiwon' },
    { id: 'nayohan-hyungjungsoon', nameKo: '나요한.형정순', nameEn: 'Na Yo-han & Hyeong Jeong-soon', path: '/photo/nayohan-hyungjungsoon' },
];

/**
 * 갤러리 이미지 타입
 */
export interface GalleryImage {
    /** 고유 식별자 */
    id: string;

    /** 카테고리 */
    category: GalleryCategory;

    /** 이미지 URL */
    src: string;

    /** 썸네일 URL (Blur-up용) */
    thumbnail?: string;

    /** 이미지 제목 */
    title?: string;

    /** 이미지 설명 */
    description?: string;

    /** 촬영 날짜 */
    date?: string;

    /** 정렬 순서 */
    order: number;

    /** 이미지 너비 (Masonry용) */
    width?: number;

    /** 이미지 높이 (Masonry용) */
    height?: number;

    /** 업로드 일시 */
    createdAt: string;
}

/**
 * 갤러리 데이터 전체 타입
 */
export interface GalleryData {
    images: GalleryImage[];
    metadata: {
        lastModified: string;
        version: string;
    };
}

/**
 * Lightbox 상태 타입
 */
export interface LightboxState {
    isOpen: boolean;
    currentIndex: number;
    images: GalleryImage[];
}
