import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GalleryImage, GalleryCategory, GalleryData } from '@/types/gallery';

// 초기 데이터 (빈 상태)
const INITIAL_GALLERY_DATA: GalleryData = {
    images: [],
    metadata: {
        lastModified: new Date().toISOString(),
        version: '1.0.0',
    },
};

interface GalleryState {
    // 데이터
    data: GalleryData;

    // 뷰 상태
    visibleCount: number;

    // 액션
    getImagesByCategory: (category: GalleryCategory) => GalleryImage[];
    addImage: (image: Omit<GalleryImage, 'id' | 'createdAt'>) => void;
    updateImage: (id: string, updates: Partial<GalleryImage>) => void;
    removeImage: (id: string) => void;
    reorderImages: (category: GalleryCategory, imageIds: string[]) => void;
    loadMore: () => void;
    resetVisibleCount: () => void;
}

const IMAGES_PER_PAGE = 8;

export const useGalleryStore = create<GalleryState>()(
    persist(
        (set, get) => ({
            data: INITIAL_GALLERY_DATA,
            visibleCount: IMAGES_PER_PAGE,

            getImagesByCategory: (category) => {
                const { data } = get();
                return data.images
                    .filter(img => img.category === category)
                    .sort((a, b) => a.order - b.order);
            },

            addImage: (imageData) => {
                const { data } = get();
                const newImage: GalleryImage = {
                    ...imageData,
                    id: `img-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                };

                set({
                    data: {
                        ...data,
                        images: [...data.images, newImage],
                        metadata: {
                            ...data.metadata,
                            lastModified: new Date().toISOString(),
                        },
                    },
                });
            },

            updateImage: (id, updates) => {
                const { data } = get();
                set({
                    data: {
                        ...data,
                        images: data.images.map(img =>
                            img.id === id ? { ...img, ...updates } : img
                        ),
                        metadata: {
                            ...data.metadata,
                            lastModified: new Date().toISOString(),
                        },
                    },
                });
            },

            removeImage: (id) => {
                const { data } = get();
                set({
                    data: {
                        ...data,
                        images: data.images.filter(img => img.id !== id),
                        metadata: {
                            ...data.metadata,
                            lastModified: new Date().toISOString(),
                        },
                    },
                });
            },

            reorderImages: (category, imageIds) => {
                const { data } = get();
                const updatedImages = data.images.map(img => {
                    if (img.category === category) {
                        const newOrder = imageIds.indexOf(img.id);
                        return newOrder >= 0 ? { ...img, order: newOrder } : img;
                    }
                    return img;
                });

                set({
                    data: {
                        ...data,
                        images: updatedImages,
                        metadata: {
                            ...data.metadata,
                            lastModified: new Date().toISOString(),
                        },
                    },
                });
            },

            loadMore: () => {
                set(state => ({
                    visibleCount: state.visibleCount + IMAGES_PER_PAGE,
                }));
            },

            resetVisibleCount: () => {
                set({ visibleCount: IMAGES_PER_PAGE });
            },
        }),
        {
            name: 'gallery-storage',
            version: 1,
            storage: createJSONStorage(() => localStorage),
        }
    )
);
