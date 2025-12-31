import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface HeroData {
    title: string;
    subtitle: string;
    imageSrc: string;
    isVideo: boolean;
    showBottomGradient?: boolean;
}

interface HeroStore {
    heroData: HeroData;
    isLoading: boolean;
    fetchHeroData: () => Promise<void>;
    updateHeroData: (data: Partial<HeroData>) => Promise<void>;
}

export const DEFAULT_HERO_DATA: HeroData = {
    title: '',
    subtitle: '',
    imageSrc: '',
    isVideo: false,
    showBottomGradient: true,
};

export const useHeroStore = create<HeroStore>((set) => ({
    heroData: DEFAULT_HERO_DATA,
    isLoading: false,
    fetchHeroData: async () => {
        set({ isLoading: true });
        try {
            const docRef = doc(db, 'hero-settings', 'main');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                set({ heroData: { ...DEFAULT_HERO_DATA, ...docSnap.data() } as HeroData });
            }
        } catch (error) {
            console.error('Failed to fetch hero data:', error);
        } finally {
            set({ isLoading: false });
        }
    },
    updateHeroData: async (data) => {
        set({ isLoading: true });
        try {
            const docRef = doc(db, 'hero-settings', 'main');
            await setDoc(docRef, data, { merge: true });
            set((state) => ({ heroData: { ...state.heroData, ...data } }));
        } catch (error) {
            console.error('Failed to update hero data:', error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));
