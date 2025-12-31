import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthStore {
    isAuthenticated: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => void;
    changePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            isAuthenticated: false,

            login: async (password: string) => {
                try {
                    const docRef = doc(db, 'settings', 'admin');
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const storedPassword = docSnap.data().password;
                        if (password === storedPassword) {
                            set({ isAuthenticated: true });
                            return true;
                        }
                        return false;
                    } else {
                        // 초기 설정: 문서가 없으면 '1234'로 생성하고 로그인 성공 처리
                        if (password === '1234') {
                            await setDoc(docRef, { password: '1234' });
                            set({ isAuthenticated: true });
                            return true;
                        }
                        return false;
                    }
                } catch (error) {
                    console.error("Login Error:", error);
                    return false;
                }
            },

            logout: () => {
                set({ isAuthenticated: false });
            },

            checkAuth: () => {
                // 필요 시 토큰 검증 로직 등 추가
            },

            changePassword: async (newPassword: string) => {
                try {
                    const docRef = doc(db, 'settings', 'admin');
                    await setDoc(docRef, { password: newPassword }, { merge: true });
                } catch (error) {
                    console.error("Change Password Error:", error);
                    throw error;
                }
            }
        }),
        {
            name: 'admin-auth-storage', // unique name
            storage: createJSONStorage(() => sessionStorage), // use sessionStorage
        }
    )
);
