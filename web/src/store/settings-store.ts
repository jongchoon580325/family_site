import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface PopupSettings {
    isActive: boolean;
    title: string;
    content: string;
    imageUrl?: string;
    linkUrl?: string;
    id: string; // Unique ID to track "Don't show today"
    startDate?: string; // YYYY-MM-DD
    endDate?: string;   // YYYY-MM-DD
}

interface SettingsState {
    mouseTrailText: string;
    isMouseTrailEnabled: boolean;

    popupSettings: PopupSettings;

    isLoading: boolean;

    // Actions
    fetchSettings: () => Promise<void>;
    updateSettings: (settings: Partial<{
        mouseTrailText: string;
        isMouseTrailEnabled: boolean;
        popupSettings: PopupSettings;
    }>) => Promise<void>;
    subscribeToSettings: () => () => void; // Returns unsubscribe function
}

const DEFAULT_POPUP: PopupSettings = {
    isActive: false,
    title: "",
    content: "",
    id: Date.now().toString(),
    startDate: "",
    endDate: ""
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
    mouseTrailText: "♥",
    isMouseTrailEnabled: false,
    popupSettings: DEFAULT_POPUP,
    isLoading: true,

    fetchSettings: async () => {
        try {
            set({ isLoading: true });
            const docRef = doc(db, 'settings', 'config');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                set({
                    mouseTrailText: data.mouseTrailText || "♥",
                    isMouseTrailEnabled: data.isMouseTrailEnabled || false,
                    popupSettings: data.popupSettings || DEFAULT_POPUP,
                    isLoading: false
                });
            } else {
                // Initialize default if not exists
                await setDoc(docRef, {
                    mouseTrailText: "♥",
                    isMouseTrailEnabled: false,
                    popupSettings: DEFAULT_POPUP
                });
                set({ isLoading: false });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            set({ isLoading: false });
        }
    },

    updateSettings: async (newSettings) => {
        try {
            const docRef = doc(db, 'settings', 'config');
            await setDoc(docRef, newSettings, { merge: true });

            // Optimistic update
            set((state) => ({ ...state, ...newSettings }));
        } catch (error) {
            console.error("Error updating settings:", error);
            throw error;
        }
    },

    subscribeToSettings: () => {
        const docRef = doc(db, 'settings', 'config');
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                set({
                    mouseTrailText: data.mouseTrailText || "♥",
                    isMouseTrailEnabled: data.isMouseTrailEnabled || false,
                    popupSettings: data.popupSettings || DEFAULT_POPUP
                });
            }
        });
        return unsubscribe;
    }
}));
