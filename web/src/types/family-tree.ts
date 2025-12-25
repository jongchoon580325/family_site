/**
 * Family Tree Type Definitions
 * 가계도 데이터 구조를 위한 TypeScript 타입 정의
 */

/**
 * 다국어 문자열 타입
 */
export interface LocalizedString {
    ko: string;
    en: string;
}

/**
 * 확장 필드 타입
 */
export interface ExtendedField {
    key: string;
    label: LocalizedString;
    type: 'text' | 'number' | 'date' | 'image';
    value: string | number | null;
}

/**
 * 가족 구성원 타입
 */
export interface FamilyMember {
    /** 고유 식별자 */
    id: string;

    /** 이름 (한국어/영어) */
    name: LocalizedString;

    /** 배우자 이름 (한국어/영어), 없으면 null */
    spouse: LocalizedString | null;

    /** 자녀 목록 (재귀 구조) */
    children: FamilyMember[];

    /** 프로필 이미지 URL (선택) */
    photo?: string;

    /** 출생년도 (선택) */
    birthYear?: number;

    /** 사망년도 (선택) */
    deathYear?: number;

    /** 역할/직업 (선택) */
    role?: LocalizedString;

    /** 메모/설명 (선택) */
    notes?: LocalizedString;

    /** 동적 확장 필드 */
    extendedFields?: ExtendedField[];
}

/**
 * 가계도 전체 데이터 타입
 */
export interface FamilyTreeData {
    /** 루트 노드 (God Father) */
    root: FamilyMember;

    /** 메타데이터 */
    metadata: {
        /** 마지막 수정 시간 */
        lastModified: string;
        /** 버전 */
        version: string;
    };
}

/**
 * 노드 위치 정보 (렌더링용)
 */
export interface NodePosition {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * 연결선 정보 (렌더링용)
 */
export interface ConnectionInfo {
    fromId: string;
    toId: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
}

/**
 * 언어 타입
 */
export type Language = 'ko' | 'en';
