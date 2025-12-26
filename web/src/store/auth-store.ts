import { create } from 'zustand';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthStore {
    isAuthenticated: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => void;
    changePassword: (newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,

    login: async (password: string) => {
        try {
            const docRef = doc(db, 'settings', 'admin');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const storedPassword = docSnap.data().password;
                if (password === storedPassword) {
                    set({ isAuthenticated: true });
                    // 세션 스토리지에 저장하여 새로고침 시 유지 (선택사항, 보안상 짧게 유지하거나 안 하는 게 나음)
                    // 여기서는 탭 닫으면 로그아웃되도록 메모리 상태만 유지
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
}));
