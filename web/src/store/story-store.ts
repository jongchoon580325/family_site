import { create } from 'zustand';
import { db } from '@/lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    orderBy,
    Timestamp,
    writeBatch
} from 'firebase/firestore';

export type StoryType = 'text' | 'image' | 'video' | 'quote';

export interface StoryItem {
    id: string;
    type: StoryType;
    title: string;
    content: string;
    description?: string;
    date: string;
    color?: string;
    src?: string;
    videoId?: string;
    author?: string;
    order: number;
    createdAt?: string;
}

interface StoryState {
    stories: StoryItem[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchStories: () => Promise<void>;
    addStory: (story: Omit<StoryItem, 'id' | 'order' | 'createdAt'>) => Promise<void>;
    removeStory: (id: string) => Promise<void>;
    updateStory: (id: string, updatedStory: Partial<StoryItem>) => Promise<void>;
    reorderStories: (fromIndex: number, toIndex: number) => Promise<void>;
}

const COLLECTION_NAME = 'stories';

export const useStoryStore = create<StoryState>((set, get) => ({
    stories: [],
    isLoading: false,
    error: null,

    fetchStories: async () => {
        set({ isLoading: true, error: null });
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
            const snapshot = await getDocs(q);
            const stories: StoryItem[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as StoryItem));
            set({ stories, isLoading: false });
        } catch (error) {
            console.error('Error fetching stories:', error);
            set({ error: 'Failed to fetch stories', isLoading: false });
        }
    },

    addStory: async (storyData) => {
        set({ isLoading: true, error: null });
        try {
            const { stories } = get();

            // Remove undefined values (Firestore doesn't accept undefined)
            const cleanedData = Object.fromEntries(
                Object.entries(storyData).filter(([_, value]) => value !== undefined)
            );

            const newStory = {
                ...cleanedData,
                order: 0, // New stories go to the top
                createdAt: Timestamp.now(),
            };

            // Shift existing stories down
            const batch = writeBatch(db);
            stories.forEach(story => {
                const docRef = doc(db, COLLECTION_NAME, story.id);
                batch.update(docRef, { order: story.order + 1 });
            });
            await batch.commit();

            const docRef = await addDoc(collection(db, COLLECTION_NAME), newStory);

            set(state => ({
                stories: [
                    { ...newStory, id: docRef.id, createdAt: new Date().toISOString() } as StoryItem,
                    ...state.stories.map(s => ({ ...s, order: s.order + 1 }))
                ],
                isLoading: false,
            }));
        } catch (error) {
            console.error('Error adding story:', error);
            set({ error: 'Failed to add story', isLoading: false });
        }
    },

    removeStory: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);

            set(state => ({
                stories: state.stories.filter(story => story.id !== id),
                isLoading: false,
            }));
        } catch (error) {
            console.error('Error removing story:', error);
            set({ error: 'Failed to remove story', isLoading: false });
        }
    },

    updateStory: async (id, updatedStory) => {
        set({ isLoading: true, error: null });
        try {
            // Remove undefined values (Firestore doesn't accept undefined)
            const cleanedData = Object.fromEntries(
                Object.entries(updatedStory).filter(([_, value]) => value !== undefined)
            );

            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, cleanedData);

            set(state => ({
                stories: state.stories.map(story =>
                    story.id === id ? { ...story, ...updatedStory } : story
                ),
                isLoading: false,
            }));
        } catch (error) {
            console.error('Error updating story:', error);
            set({ error: 'Failed to update story', isLoading: false });
        }
    },

    reorderStories: async (fromIndex, toIndex) => {
        const { stories } = get();
        const newStories = [...stories];
        const [movedItem] = newStories.splice(fromIndex, 1);
        newStories.splice(toIndex, 0, movedItem);

        // Update order for all affected items
        const updatedStories = newStories.map((story, index) => ({
            ...story,
            order: index,
        }));

        set({ stories: updatedStories });

        // Update in Firestore
        try {
            const batch = writeBatch(db);
            updatedStories.forEach(story => {
                const docRef = doc(db, COLLECTION_NAME, story.id);
                batch.update(docRef, { order: story.order });
            });
            await batch.commit();
        } catch (error) {
            console.error('Error reordering stories:', error);
            // Revert on error
            set({ stories });
        }
    },
}));
