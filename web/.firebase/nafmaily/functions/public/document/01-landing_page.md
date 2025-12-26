# PRD: Header & Footer Design Layout

## 1. 개요 (Overview)

본 문서는 "우리가족 이야기" 웹사이트의 **랜딩 페이지(Landing Page)** 중, 핵심 네비게이션 영역인 **Header**와 하단 정보 영역인 **Footer**의 디자인 및 기능 요구사항을 정의합니다. 본문(Contents) 영역은 추후 기획에 따라 채워질 예정이며, 현재는 비워둡니다.

## 2. 디자인 요구사항 (Design Specs)

### 2.1. 전체 레이아웃 (Layout)

* **Header**: 상단 고정 (Sticky), 스크롤 시 배경 블러(Glassmorphism) 처리.
* **Content**: 초기 상태는 **Empty (공백)**. 헤더와 푸터 사이의 공간 확보.
* **Footer**: 하단 고정 아님(콘텐츠 길이에 따라 위치), 심플하고 정돈된 정보 표시.

### 2.2. 타이포그래피 & 간격 (Typography & Spacing)

* **폰트**: `Noto Sans KR` (기본), `Noto Serif KR` (로고/강조).
* **Menu Font Size**: `16px` (1rem) -> 가독성 확보. (기존 14px 대비 확대)
* **Menu Spacing**: 아이템 간 간격 `32px` (gap-8) -> 시원한 여백.
* **Font Weight**: Normal(400)을 기본으로 하고, Hover/Active 시 Medium(500)으로 변화.

### 2.3. 애니메이션 (Animations - Framer Motion)

* **Hover Effect**: 메뉴 아이템 위에 마우스를 올리면, 텍스트 배경에 **'Floating Pill'** (둥근 회색 배경)이 부드럽게 따라다니는 효과. (`layoutId` 활용)
* **Active State**: 현재 페이지 메뉴는 `Primary Color` (Amber-800)로 텍스트 색상 고정 및 하단 인디케이터(Indicator) 표시 고려.
* **Mobile Drawer**: 햄버거 버튼 클릭 시, 우측에서 좌측으로(또는 위에서 아래로) 부드럽게 펼쳐지는 슬라이딩 애니메이션.
* **Dropdown**: 서브메뉴 오픈 시 `Opacity: 0 -> 1`, `Y: -10px -> 0px` 의 자연스러운 등장 효과.

## 3. 기능 요구사항 (Functional Specs)

### 3.1. Header

1. **Logo**: 좌측 상단 배치. 클릭 시 `window.scrollTo(0,0)` 실행.
2. **GNB (Global Navigation Bar)**:
    * HOME / Photo (Dropdown) / Tree / Mom / Story / Donates / Upload
    * 화면 너비 768px 미만 시 **Hamburger Menu**로 대체.
3. **Dropdown**: 마우스 오버(Hover) 시 즉시 반응, 마우스 아웃 시 일정 시간(0.2s) 후 사라짐(UX 개선).

### 3.2. Footer

1. **Copyright**: 2단 구성, 중앙정렬

* 1단 : `A family of faith that serves God until Jesus Christ returns.
* 2단 : Copyright ⓒ 1924~2025, 예수 그리스도께서 다시 오실 때까지 하나님을 섬기는 믿음의 가정.`
* '2025' : 현재년도 스크립트 작성 (예: 1924~ 현재년도 표시)

## 4. 구현 계획 (Implementation)

1. `page.tsx`의 기존 히어로 섹션 삭제 및 `<div className="min-h-[80vh]" />`로 빈 공간 대체.
2. `header.tsx` 스타일 고도화 (폰트 사이즈업, 간격 조정, Pill 애니메이션 정교화).
3. `footer.tsx` 디자인 개선.
