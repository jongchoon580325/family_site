import { create } from 'zustand';
import { db, storage } from '@/lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    writeBatch
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { GalleryImage, GalleryCategory } from '@/types/gallery';

interface GalleryState {
    images: GalleryImage[];
    isLoading: boolean;
    error: string | null;
    visibleCount: number;

    // Actions
    fetchImages: () => Promise<void>;
    getImagesByCategory: (category: GalleryCategory) => GalleryImage[];
    addImage: (imageData: Omit<GalleryImage, 'id' | 'createdAt'>, file?: File) => Promise<void>;
    updateImage: (id: string, updates: Partial<GalleryImage>) => Promise<void>;
    removeImage: (id: string, imageUrl?: string) => Promise<void>;
    reorderImages: (category: GalleryCategory, imageIds: string[]) => Promise<void>;
    loadMore: () => void;
    resetVisibleCount: () => void;
}

const IMAGES_PER_PAGE = 8;
const COLLECTION_NAME = 'galleries';

export const useGalleryStore = create<GalleryState>((set, get) => ({
    images: [],
    isLoading: false,
    error: null,
    visibleCount: IMAGES_PER_PAGE,

    fetchImages: async () => {
        set({ isLoading: true, error: null });
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
            const snapshot = await getDocs(q);
            const images: GalleryImage[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as GalleryImage));
            set({ images, isLoading: false });
        } catch (error) {
            console.error('Error fetching images:', error);
            set({ error: 'Failed to fetch images', isLoading: false });
        }
    },

    getImagesByCategory: (category) => {
        const { images } = get();
        return images
            .filter(img => img.category === category)
            .sort((a, b) => a.order - b.order);
    },

    addImage: async (imageData, file) => {
        set({ isLoading: true, error: null });
        try {
            let src = imageData.src;

            // Upload file to Storage if provided
            if (file) {
                const storageRef = ref(storage, `galleries/${Date.now()}-${file.name}`);
                await uploadBytes(storageRef, file);
                src = await getDownloadURL(storageRef);
            }

            const newImage = {
                ...imageData,
                src,
                createdAt: Timestamp.now(),
            };

            const docRef = await addDoc(collection(db, COLLECTION_NAME), newImage);

            // Update local state
            set(state => ({
                images: [...state.images, { ...newImage, id: docRef.id, createdAt: new Date().toISOString() } as GalleryImage],
                isLoading: false,
            }));
        } catch (error) {
            console.error('Error adding image:', error);
            set({ error: 'Failed to add image', isLoading: false });
        }
    },

    updateImage: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, updates);

            set(state => ({
                images: state.images.map(img =>
                    img.id === id ? { ...img, ...updates } : img
                ),
                isLoading: false,
            }));
        } catch (error) {
            console.error('Error updating image:', error);
            set({ error: 'Failed to update image', isLoading: false });
        }
    },

    removeImage: async (id, imageUrl) => {
        set({ isLoading: true, error: null });
        try {
            // Delete from Firestore
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);

            // Delete from Storage if it's a Firebase Storage URL
            if (imageUrl && imageUrl.includes('firebasestorage')) {
                try {
                    const storageRef = ref(storage, imageUrl);
                    await deleteObject(storageRef);
                } catch (storageError) {
                    console.warn('Could not delete storage file:', storageError);
                }
            }

            set(state => ({
                images: state.images.filter(img => img.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            console.error('Error removing image:', error);
            set({ error: 'Failed to remove image', isLoading: false });
        }
    },

    reorderImages: async (category, imageIds) => {
        const { images } = get();

        // Update local state immediately
        const updatedImages = images.map(img => {
            if (img.category === category) {
                const newOrder = imageIds.indexOf(img.id);
                return newOrder >= 0 ? { ...img, order: newOrder } : img;
            }
            return img;
        });

        set({ images: updatedImages });

        // Update in Firestore
        try {
            const batch = writeBatch(db);
            imageIds.forEach((id, index) => {
                const docRef = doc(db, COLLECTION_NAME, id);
                batch.update(docRef, { order: index });
            });
            await batch.commit();
        } catch (error) {
            console.error('Error reordering images:', error);
            // Revert on error
            set({ images });
        }
    },

    loadMore: () => {
        set(state => ({
            visibleCount: state.visibleCount + IMAGES_PER_PAGE,
        }));
    },

    resetVisibleCount: () => {
        set({ visibleCount: IMAGES_PER_PAGE });
    },
}));
