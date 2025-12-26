# Photo Gallery 개발 문서

## 📌 개요

6개의 가족 서브페이지에 프리미엄 포토 갤러리 기능을 구현하는 개발 계획서입니다.

---

## 🎯 핵심 기능

### 1. 공용 컴포넌트 설계

- `<PhotoGallery>` 컴포넌트로 6개 서브페이지에서 공유
- Props: `category`, `title`, `description`

### 2. 카테고리별 이미지 관리

- Manager 페이지 "Gallery" 메뉴에서 카테고리 선택 후 업로드
- 카테고리: 나기봉.김필자, 나종춘.장명애, 나종섭.김양진 등
- LocalStorage → 추후 Firebase 이관 대비

### 3. 호버 특수 효과 (Ripple Wave)

- 중앙에서 퍼지는 물결 리플 효과
- CSS `radial-gradient` + Framer Motion 조합
- 부드러운 scale-up 및 shadow 확대

### 4. Lightbox 슬라이더

- 이미지 클릭 시 전체화면 모달
- 좌우 화살표 네비게이션
- 모바일 스와이프 제스처 지원
- ESC 키 또는 배경 클릭으로 닫기

### 5. 프리미엄 외곽선

- 이미지: 황금 amber 테두리 + 라운드 코너
- 섹션: Mom 페이지 스타일 이중 프레임 + 코너 장식

### 6. 그리드 레이아웃

- 반응형: 모바일 2열, 태블릿 3열, 데스크탑 4열
- gap-4 간격

---

## ✨ 적용 기법 3가지

### 1. Masonry Grid (불규칙 배열)

```
다양한 높이의 이미지를 Pinterest 스타일로 불규칙 배열
→ 시각적 다이나미즘과 모던함
```

### 2. Parallax Hover (3D 기울기)

```
마우스 위치에 따라 이미지가 3D로 기울어지는 효과
→ 입체감과 프리미엄 인터랙션
```

### 3. Blur-up Loading (점진적 로딩)

```
저해상도 블러 이미지 → 고해상도 이미지 점진적 전환
→ 빠른 체감 속도와 부드러운 UX
```

---

## 🔧 추가 기능

### 더 보기 (Load More)

- 초기 8개 이미지만 표시
- "더 보기" 버튼 클릭 시 8개씩 추가 로드
- 모든 이미지 로드 완료 시 버튼 숨김
- 카운터 표시: "8 / 24장"

### 위로가기 (Scroll to Top)

- 스크롤 200px 이상 시 우측 하단에 버튼 표시
- 부드러운 스크롤 애니메이션
- 호버 시 툴팁 "맨 위로"

---

## 📁 파일 구조

```
src/
├── components/
│   └── gallery/
│       ├── PhotoGallery.tsx      # 메인 갤러리 컴포넌트
│       ├── GalleryGrid.tsx       # Masonry 그리드
│       ├── GalleryImage.tsx      # 개별 이미지 (Parallax Hover)
│       ├── GalleryLightbox.tsx   # 전체화면 슬라이더
│       ├── LoadMoreButton.tsx    # 더 보기 버튼
│       └── ScrollToTop.tsx       # 위로가기 버튼
│   └── manager/
│       └── GalleryEditor.tsx     # 관리자 업로드 UI
├── store/
│   └── gallery-store.ts          # Zustand 이미지 저장소
└── types/
    └── gallery.ts                # 타입 정의
```

---

## 🎨 디자인 스펙

| 요소 | 스타일 |
|------|--------|
| 이미지 테두리 | `border-2 border-amber-200/50 rounded-xl` |
| 섹션 배경 | `bg-gradient-to-br from-amber-100/80 via-orange-50/60` |
| 호버 그림자 | `shadow-2xl shadow-amber-500/20` |
| 라이트박스 배경 | `bg-black/90 backdrop-blur-md` |
| 버튼 스타일 | `bg-amber-500 text-white rounded-full` |

---

## ✅ 구현 체크리스트

- [x] 타입 정의 (`GalleryImage`, `GalleryCategory`)
- [x] Zustand 스토어 생성 (CRUD, 카테고리별 필터)
- [x] PhotoGallery 메인 컴포넌트
- [x] GalleryImage 개별 컴포넌트 (Parallax + Ripple)
- [x] Masonry Grid 레이아웃
- [x] Lightbox 모달 + 슬라이더
- [x] 더 보기 버튼 + 카운터
- [x] 위로가기 버튼
- [x] Manager 페이지 Gallery 메뉴 추가
- [x] GalleryEditor 업로드 폼
- [x] 6개 서브페이지에 통합
- [x] 프리미엄 외곽선 적용
