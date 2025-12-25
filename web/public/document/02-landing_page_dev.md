# 랜딩페이지 개발 문서 (Landing Page Development Spec)
>
> **Version**: 1.0 (Draft)
> **Last Updated**: 2024-12-24
> **Status**: 사용자 검토 대기

---

## 1. 개요 (Overview)

본 문서는 "하나님을 섬기는 믿음의 가정" 웹사이트 랜딩페이지(HOME) 개발 사양을 정의합니다.
기존 WordPress(DIVI) 사이트의 디자인 철학과 콘텐츠 구조를 유지하면서, Next.js 기반의 현대적 기술 스택으로 재구현합니다.

### 1.1. 핵심 원칙

- **다크 테마 유지**: 검정 배경 + 앰버/골드/브라운 악센트
- **세로 스크롤 스토리텔링**: 기존 섹션 흐름 및 원문 텍스트 그대로 유지
- **이중 언어 지원**: 한글 + 영문 조화 (미국 가족 고려)
- **관리자 확장성**: 결혼 카드 등 콘텐츠를 Manager 페이지에서 관리 가능

---

## 2. 섹션 구조 (Section Structure)

```
┌─────────────────────────────────────────────────┐
│  HERO SECTION                                    │
│  - 패럴랙스 스크롤 효과                           │
│  - 빈티지 가족사진 배경                           │
│  - 슬로건 (EN + KR)                              │
│  - 하단 검정 그라데이션 (자연스러운 전환)          │
└─────────────────────────────────────────────────┘
                    ↓ (간격: 최소화)
┌─────────────────────────────────────────────────┐
│  BIBLE VERSE SECTION (신규)                      │
│  "태초에 하나님이 천지를 창조하시니라"              │
│  "In the beginning God created                  │
│   the heaven and the earth." - Genesis 1:1      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  SECTION 1: 새 가족의 시작                       │
│  "A new family begins. 새 가족의 시작"           │
│  - 나기봉 & 김필자 결혼 사진 + 소개 텍스트         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  SECTION 2: 새 생명의 시작                       │
│  "A new life begins. 새 생명의 시작"             │
│  - 자녀 소개 + 성경말씀 (시편 127:3-5)            │
│  - 자녀 수 카운터 (아들, 딸, 손자, 손녀)          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  SECTION 3: 기적같은 만남의 시작                  │
│  "WHAT A WONDERFUL MIRACLE!"                    │
│  "기적같은 만남의 시작"                          │
│                                                 │
│  [결혼 카드 그리드]                              │
│  - 각 부부: 결혼사진 + 이름 + 결혼일             │
│  - 클릭 시 해당 Photo Gallery 연결              │
│  - ⚡ Manager 페이지에서 관리 가능               │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  FOOTER                                         │
└─────────────────────────────────────────────────┘
```

---

## 3. 기술 사양 (Technical Specifications)

### 3.1. Hero Section - 패럴랙스 + 그라데이션

```typescript
// 구현 기술
- Framer Motion: useScroll() + useTransform()
- 패럴랙스 효과: 스크롤 시 배경 이미지가 콘텐츠보다 느리게 이동
- 하단 그라데이션: CSS gradient overlay (투명 → 검정)
```

**예시 구현:**

```tsx
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, 150]); // 패럴랙스

<div className="relative h-screen overflow-hidden">
  <motion.div 
    style={{ y }} 
    className="absolute inset-0 bg-cover bg-center"
  />
  {/* 하단 그라데이션 오버레이 */}
  <div className="absolute bottom-0 left-0 right-0 h-48 
                  bg-gradient-to-t from-black via-black/50 to-transparent" />
</div>
```

### 3.2. Bible Verse Section (신규)

| 항목 | 값 |
|------|-----|
| 배경 | 검정 또는 어두운 패턴 |
| 한글 | "태초에 하나님이 천지를 창조하시니라" |
| 영문 | "In the beginning God created the heaven and the earth." |
| 출처 | Genesis 1:1 / 창세기 1:1 |
| 효과 | 스크롤 시 Fade-in 애니메이션 (권장) |

**디자인 제안:**

- 심플하고 경건한 느낌
- 중앙 정렬, 세리프 폰트 사용
- 앰버/골드 컬러 악센트 (장식선 또는 따옴표)

### 3.3. 결혼 카드 섹션 (Manager 연동)

**데이터 구조:**

```typescript
interface WeddingCard {
  id: string;
  groomName: string;        // 신랑 이름
  brideName: string;        // 신부 이름
  weddingDate: string;      // 결혼일 (YYYY.MM.DD)
  photoUrl: string;         // 결혼 사진
  gallerySlug: string;      // 연결될 Photo Gallery slug
  order: number;            // 정렬 순서
  isVisible: boolean;       // 표시 여부
}
```

**Manager 페이지 기능:**

- 결혼 카드 추가/수정/삭제
- 드래그 앤 드롭으로 순서 변경
- 사진 업로드 (압축 적용)
- 표시/숨김 토글

### 3.4. 섹션 간격 (Margins)

| 위치 | 기존 (추정) | 권장 변경 |
|------|------------|----------|
| Hero → Bible | - | `py-16` (64px) |
| Bible → Section 1 | 넓음 | `py-12` (48px) |
| Section 간 | 넓음 | `py-16` (64px) |

> **개발자 의견**: 콘텐츠 밀도를 높이면 스크롤이 짧아지지만,
> 모바일에서 가독성이 떨어질 수 있습니다.
> 실제 구현 후 조정 권장.

---

## 4. 색상 팔레트 (Color Palette)

```css
/* 다크 테마 기반 */
--background: #000000;           /* 검정 배경 */
--foreground: #f5f5f4;           /* stone-100 텍스트 */

/* 악센트 컬러 */
--accent-primary: #b45309;       /* amber-700 */
--accent-secondary: #78350f;     /* amber-900 */
--accent-gold: #d4af37;          /* 골드 */

/* 카드/섹션 배경 */
--card-bg: #7c2d12;              /* stone-800 또는 brown-800 */
--card-border: rgba(180,83,9,0.3); /* amber 반투명 */
```

---

## 5. 관리자 기능 확장 (Manager Page)

### 5.1. 신규 메뉴: "Landing Page"

```
Manager Sidebar:
├── Story Upload (기존)
├── Gallery (기존)
├── Family Tree (기존)
├── Landing Page (신규) ← 추가
│   ├── Hero 설정 (배경 이미지, 슬로건)
│   ├── Bible Verse 설정
│   └── 결혼 카드 관리
└── Site Settings (기존)
```

### 5.2. 저장소 구조

```typescript
// landing-store.ts (신규 생성 예정)
interface LandingPageState {
  hero: {
    backgroundImage: string;
    sloganEn: string;
    sloganKr: string;
  };
  bibleVerse: {
    textKr: string;
    textEn: string;
    reference: string;
  };
  weddingCards: WeddingCard[];
}
```

---

## 6. 구현 우선순위

| 순위 | 항목 | 난이도 | 예상 시간 |
|-----|------|-------|----------|
| 1 | Hero + 패럴랙스 + 그라데이션 | ⭐⭐⭐ | 2시간 |
| 2 | Bible Verse 섹션 | ⭐ | 30분 |
| 3 | Section 1-2 (정적 콘텐츠) | ⭐⭐ | 1시간 |
| 4 | 결혼 카드 섹션 (정적) | ⭐⭐ | 1시간 |
| 5 | 결혼 카드 Manager 연동 | ⭐⭐⭐ | 2시간 |
| 6 | 반응형 최적화 | ⭐⭐ | 1시간 |

**총 예상 시간: 약 7-8시간**

---

## 7. 원문 콘텐츠 참조

> ⚠️ 아래 텍스트는 사용자가 직접 작성한 콘텐츠로, **수정 없이 그대로 사용**해야 합니다.

### Hero 슬로건

- EN: "WE ARE A FAMILY OF FAITH THAT SERVES GOD THE CREATOR."
- KR: "창조주 하나님을 믿는 믿음의 가정입니다."

### Bible Verse (신규)

- KR: "태초에 하나님이 천지를 창조하시니라"
- EN: "In the beginning God created the heaven and the earth."
- Ref: Genesis 1:1

### Section 1 제목

- EN: "A new family begins."
- KR: "새 가족의 시작"

### Section 2 제목

- EN: "A new life begins."
- KR: "새 생명의 시작"

### Section 3 제목

- EN: "WHAT A WONDERFUL MIRACLE!"
- KR: "기적같은 만남의 시작"

---

## 8. 다음 단계

1. ✅ 사용자 검토 및 피드백 수집
2. ⬜ Implementation Plan 작성 (세부 코드 구현 계획)
3. ⬜ 컴포넌트 개발 시작
4. ⬜ Manager 연동 개발
5. ⬜ 테스트 및 최적화

---

**문서 작성자**: AI Developer  
**검토 상태**: 🟡 사용자 확인 대기 중
