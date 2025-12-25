import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type StoryType = 'text' | 'image' | 'video' | 'quote';

export interface StoryItem {
    id: number;
    type: StoryType;
    title: string;
    content: string; // Used for text content, image description, or quote
    description?: string; // Used specifically for Video description
    date: string;
    color?: string; // For text/quote cards
    src?: string; // For image cards
    videoId?: string; // For video cards
    author?: string; // For quote cards
}

interface StoryState {
    stories: StoryItem[];
    addStory: (story: Omit<StoryItem, 'id'>) => void;
    removeStory: (id: number) => void;
    updateStory: (id: number, updatedStory: Partial<StoryItem>) => void;
    reorderStories: (fromIndex: number, toIndex: number) => void;
    clearAllStories: () => void;
}

const INITIAL_DATA: StoryItem[] = [
    {
        id: 1,
        type: "text",
        title: "가족의 시작",
        content: "우리 가족이 처음 하나님 안에서 하나가 되었던 그 날을 기억합니다. 작은 기도와 믿음으로 시작된 이 가정에 주님의 은혜가 넘치기를 소망합니다.\n\n서로를 아끼고 사랑하며, 주님의 말씀을 따르는 가정이 되기를 기도합니다.",
        date: "1980.05.21",
        color: "bg-amber-50"
    },
    {
        id: 2,
        type: "image",
        title: "할머니의 성경책",
        content: "매일 아침 묵상하시던 낡은 성경책. 그 안에는 우리를 위한 기도가 가득 담겨있습니다.",
        src: "/images/donates/card-01.png",
        date: "2010.12.25"
    },
    {
        id: 3,
        type: "video",
        title: "서현이를 위한 할아버지의 기도",
        videoId: "M7lc1UVf-VE",
        description: "첫 돌을 맞이한 서현이를 위해 간절히 기도해주시는 할아버지의 모습입니다.",
        date: "2015.03.10",
        content: ""
    },
    {
        id: 4,
        type: "quote",
        content: "사랑합니다. 나의 예수님.\n사랑합니다. 아주 많이요.",
        author: "할아버지의 일기장 중",
        color: "bg-slate-800 text-white",
        title: "신앙 고백",
        date: "2013.01.01"
    },
    {
        id: 5,
        type: "text",
        title: "미국에 보내는 편지",
        content: "사랑하는 손주들아, 너희가 어디에 있든지 하나님이 항상 동행하심을 잊지 말아라. 할미는 매일 너희를 위해 기도하고 있단다. 보고 싶구나.\n\n언제나 건강하고, 주님 안에서 기쁨을 잃지 말아라. 사랑한다.",
        date: "2020.01.01",
        color: "bg-white border border-stone-200"
    },
    {
        id: 6,
        type: "image",
        title: "가족 여행",
        content: "2018년 여름, 모두가 함께했던 제주도 여행. 푸른 바다와 맑은 하늘 아래서 우리는 행복했습니다.",
        src: "/images/donates/card-02.png",
        date: "2018.08.15"
    },
    {
        id: 7,
        type: "video",
        title: "하윤이를 위한 축복",
        videoId: "M7lc1UVf-VE",
        description: "새 생명의 탄생을 축하하며.",
        date: "2019.05.05",
        content: ""
    },
    {
        id: 8,
        type: "text",
        title: "감사의 고백",
        content: "지금까지 지내온 것 주의 크신 은혜라. 한이 없는 주의 사랑 어찌 이루 말하랴.",
        date: "2023.11.19",
        color: "bg-amber-100"
    }
];

export const useStoryStore = create<StoryState>()(
    persist(
        (set) => ({
            stories: INITIAL_DATA,
            addStory: (story) => set((state) => ({
                stories: [
                    { ...story, id: Math.max(...state.stories.map(s => s.id), 0) + 1 },
                    ...state.stories
                ]
            })),
            removeStory: (id) => {
                try {
                    set((state) => ({
                        stories: state.stories.filter((story) => story.id !== id)
                    }));
                } catch (e) {
                    console.error("Failed to delete story:", e);
                    alert("Failed to delete story. Local storage might be corrupted.");
                }
            },
            updateStory: (id, updatedStory) => set((state) => ({
                stories: state.stories.map((story) =>
                    story.id === id ? { ...story, ...updatedStory } : story
                )
            })),
            reorderStories: (fromIndex, toIndex) => set((state) => {
                const newStories = [...state.stories];
                const [movedItem] = newStories.splice(fromIndex, 1);
                newStories.splice(toIndex, 0, movedItem);
                return { stories: newStories };
            }),
            clearAllStories: () => {
                localStorage.removeItem('family-site-story-storage');
                set({ stories: INITIAL_DATA });
            }
        }),
        {
            name: 'family-site-story-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
