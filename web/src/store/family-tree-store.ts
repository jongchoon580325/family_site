import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FamilyMember, FamilyTreeData, Language } from '@/types/family-tree';

// 초기 가계도 데이터 (첨부 이미지 기반)
const INITIAL_FAMILY_DATA: FamilyTreeData = {
    root: {
        id: 'god-father',
        name: { ko: 'God Father', en: 'God Father' },
        spouse: null,
        children: [
            {
                id: 'na-geun-sik',
                name: { ko: '나근식', en: 'Na Geun-sik' },
                spouse: { ko: '장국팔', en: 'Jang Gook-pal' },
                children: [
                    {
                        id: 'na-gi-bong',
                        name: { ko: '나기봉', en: 'Na Gi-bong' },
                        spouse: { ko: '김필자', en: 'Kim Phil-ja' },
                        children: [
                            {
                                id: 'na-jong-choon',
                                name: { ko: '나종춘', en: 'Na Jong-choon' },
                                spouse: { ko: '장명애', en: 'Jang Myeong-aei' },
                                children: [
                                    {
                                        id: 'na-han-na',
                                        name: { ko: '나한나', en: 'Na Han-na' },
                                        spouse: { ko: '정기원', en: 'Jeong Gi-won' },
                                        children: [
                                            {
                                                id: 'jung-ha-yoon',
                                                name: { ko: '정하윤', en: 'Jung Ha-yoon' },
                                                spouse: null,
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        id: 'na-yo-han',
                                        name: { ko: '나요한', en: 'Na Yo-han' },
                                        spouse: { ko: '형정순', en: 'Hyeong Jeong-soon' },
                                        children: [
                                            {
                                                id: 'na-seo-hyun',
                                                name: { ko: '나서현', en: 'Na Seo-hyun' },
                                                spouse: null,
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: 'na-jong-hoon',
                                name: { ko: '나종훈', en: 'Na Jong-hoon' },
                                spouse: null,
                                children: []
                            },
                            {
                                id: 'na-jong-cheol',
                                name: { ko: '나종철', en: 'Na Jong-cheol' },
                                spouse: null,
                                children: []
                            },
                            {
                                id: 'na-jong-seop',
                                name: { ko: '나종섭', en: 'Na Jong-seop' },
                                spouse: { ko: '김양진', en: 'Kim Yang-jin' },
                                children: [
                                    {
                                        id: 'na-gyeong-chan',
                                        name: { ko: '나경찬', en: 'Sam' },
                                        spouse: null,
                                        children: []
                                    },
                                    {
                                        id: 'na-gyeong-hoon',
                                        name: { ko: '나경훈', en: 'Brian' },
                                        spouse: null,
                                        children: []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 'kim-phil-ja-sister',
                        name: { ko: '김필자', en: 'Kim Phil-ja' },
                        spouse: null,
                        children: []
                    }
                ]
            },
            {
                id: 'kim-ki-hong',
                name: { ko: '김기홍', en: 'Kim Ki-hong' },
                spouse: { ko: '황후남', en: 'Hwang Hoo-nam' },
                children: [
                    {
                        id: 'na-shin-suk',
                        name: { ko: '나신숙', en: 'Na Shin-suk' },
                        spouse: { ko: '김진수', en: 'Kim Jin-su' },
                        children: [
                            {
                                id: 'kim-shi-hoo',
                                name: { ko: '김시후', en: 'Kim Shi-hoo' },
                                spouse: null,
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    metadata: {
        lastModified: new Date().toISOString(),
        version: '1.0.0'
    }
};

interface FamilyTreeState {
    // 데이터
    data: FamilyTreeData;
    language: Language;

    // 액션
    setLanguage: (lang: Language) => void;
    addMember: (parentId: string, member: FamilyMember) => void;
    updateMember: (id: string, updates: Partial<FamilyMember>) => void;
    removeMember: (id: string) => void;
    resetData: () => void;

    // 유틸리티
    findMemberById: (id: string) => FamilyMember | null;
    getAllMembers: () => FamilyMember[];
}

// 헬퍼 함수: 트리에서 멤버 찾기
function findMemberInTree(node: FamilyMember, id: string): FamilyMember | null {
    if (node.id === id) return node;
    for (const child of node.children) {
        const found = findMemberInTree(child, id);
        if (found) return found;
    }
    return null;
}

// 헬퍼 함수: 트리에서 부모 찾기
function findParentInTree(node: FamilyMember, childId: string, parent: FamilyMember | null = null): FamilyMember | null {
    if (node.id === childId) return parent;
    for (const child of node.children) {
        const found = findParentInTree(child, childId, node);
        if (found) return found;
    }
    return null;
}

// 헬퍼 함수: 모든 멤버 가져오기
function collectAllMembers(node: FamilyMember, members: FamilyMember[] = []): FamilyMember[] {
    members.push(node);
    for (const child of node.children) {
        collectAllMembers(child, members);
    }
    return members;
}

// 헬퍼 함수: 트리 복사 및 수정
function updateMemberInTree(node: FamilyMember, id: string, updates: Partial<FamilyMember>): FamilyMember {
    if (node.id === id) {
        return { ...node, ...updates };
    }
    return {
        ...node,
        children: node.children.map(child => updateMemberInTree(child, id, updates))
    };
}

// 헬퍼 함수: 멤버 추가
function addMemberToTree(node: FamilyMember, parentId: string, newMember: FamilyMember): FamilyMember {
    if (node.id === parentId) {
        return {
            ...node,
            children: [...node.children, newMember]
        };
    }
    return {
        ...node,
        children: node.children.map(child => addMemberToTree(child, parentId, newMember))
    };
}

// 헬퍼 함수: 멤버 삭제
function removeMemberFromTree(node: FamilyMember, id: string): FamilyMember {
    return {
        ...node,
        children: node.children
            .filter(child => child.id !== id)
            .map(child => removeMemberFromTree(child, id))
    };
}

export const useFamilyTreeStore = create<FamilyTreeState>()(
    persist(
        (set, get) => ({
            data: INITIAL_FAMILY_DATA,
            language: 'ko',

            setLanguage: (lang) => set({ language: lang }),

            addMember: (parentId, member) => {
                const { data } = get();
                const newRoot = addMemberToTree(data.root, parentId, member);
                set({
                    data: {
                        ...data,
                        root: newRoot,
                        metadata: {
                            ...data.metadata,
                            lastModified: new Date().toISOString()
                        }
                    }
                });
            },

            updateMember: (id, updates) => {
                const { data } = get();
                const newRoot = updateMemberInTree(data.root, id, updates);
                set({
                    data: {
                        ...data,
                        root: newRoot,
                        metadata: {
                            ...data.metadata,
                            lastModified: new Date().toISOString()
                        }
                    }
                });
            },

            removeMember: (id) => {
                const { data } = get();
                // 루트 노드는 삭제 불가
                if (data.root.id === id) return;

                const newRoot = removeMemberFromTree(data.root, id);
                set({
                    data: {
                        ...data,
                        root: newRoot,
                        metadata: {
                            ...data.metadata,
                            lastModified: new Date().toISOString()
                        }
                    }
                });
            },

            resetData: () => {
                set({ data: INITIAL_FAMILY_DATA });
            },

            findMemberById: (id) => {
                const { data } = get();
                return findMemberInTree(data.root, id);
            },

            getAllMembers: () => {
                const { data } = get();
                return collectAllMembers(data.root);
            }
        }),
        {
            name: 'family-tree-storage',
            version: 1
        }
    )
);
