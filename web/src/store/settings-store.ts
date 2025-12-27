import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

interface SettingsState {
    mouseTrailText: string;
    isMouseTrailEnabled: boolean;
    isLoading: boolean;

    // Actions
    fetchSettings: () => Promise<void>;
    updateSettings: (settings: Partial<{ mouseTrailText: string; isMouseTrailEnabled: boolean }>) => Promise<void>;
    subscribeToSettings: () => () => void; // Returns unsubscribe function
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
    mouseTrailText: "♥",
    isMouseTrailEnabled: false,
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
                    isLoading: false
                });
            } else {
                // Initialize default if not exists
                await setDoc(docRef, {
                    mouseTrailText: "♥",
                    isMouseTrailEnabled: false
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
                    isMouseTrailEnabled: data.isMouseTrailEnabled || false
                });
            }
        });
        return unsubscribe;
    }
}));
