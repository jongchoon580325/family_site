# Project Commit History

23\.

- **Date**: 2025-12-27 11:00:00
- **Commit Hash**: `To be updated`
- **Summary**: 관리자 UX 개선 - Gallery 에디터에서 이미지 제목 입력 후 'Enter' 키를 누르면 즉시 업로드/저장이 실행되도록 편의성 개선.

22\.

- **Date**: 2025-12-27 10:40:00
- **Commit Hash**: `368d971`
- **Summary**: PWA/캐싱 이슈 긴급 수정 - PC 설치 시 앱 아이콘 깨짐 방지를 위한 이미지 리사이징(192px/512px Square) 적용 및 Chrome 브라우저의 강력한 캐싱으로 인한 업데이트 지연 방지(Firebase Hosting Header 강화).

21\.

- **Date**: 2025-12-27 10:10:00
- **Commit Hash**: `cc89eed`
- **Summary**: 버그 수정 - PC와 모바일 브라우저 환경에서 하단 푸터(Footer) 영역이 이중으로 중첩되어 표시되던 렌더링 오류 수정.

20\.

- **Date**: 2025-12-27 10:00:00
- **Commit Hash**: `5fef9c1`
- **Summary**: 유지보수 기능 추가 - PC 데스크탑 앱 설치 아이콘 호환성 개선(Manifest 수정) 및 새로운 배포 감지 시 "앱 업데이트" 알림 기능(Version Checker) 구현.

19\.

- **Date**: 2025-12-27 09:50:00
- **Commit Hash**: `9643ff7`
- **Summary**: Tree 페이지 "가족 명단" 섹션 디자인 고도화 - 상단 가계도 섹션과 동일한 **프리미엄 테두리 및 배경 패턴** 로직을 적용하여 페이지 전체의 시각적 통일성 및 완성도 극대화.

18\.

- **Date**: 2025-12-27 09:40:00
- **Commit Hash**: `940751d`
- **Summary**: Tree 페이지 "가족 명단" 디자인 개선 - 세대별(1세대: Amber, 2세대: Sky, 3세대: Rose)로 파스텔톤 컬러 테마를 적용하여 시각적 구분을 명확히 함.

17\.

- **Date**: 2025-12-27 09:30:00
- **Commit Hash**: `8d4009f`
- **Summary**: Tree 페이지 신규 섹션("가족 명단") 추가 - 텍스트 데이터를 시각화하여 각 가정별(나기봉, 나종춘, 나종섭 등) 구성원을 직관적인 카드형 그리드 UI로 구현.

16\.

- **Date**: 2025-12-27 09:10:00
- **Commit Hash**: `714cacf`
- **Summary**: 배포 주소 변경 - 프로젝트 ID를 `nafmaily`에서 올바른 철자인 `nafamily`로 변경하여 `nafamily.web.app`으로 정상 접속되도록 인프라 이관 완료.

15\.

- **Date**: 2025-12-26 20:30:00
- **Commit Hash**: `56b5681`
- **Summary**: 랜딩 페이지 "새 가족의 시작" 섹션 모바일 타이틀 2단 분리(줄바꿈) 적용.

14\.

- **Date**: 2025-12-26 20:20:00
- **Commit Hash**: `c5a92e3`
- **Summary**: 랜딩 페이지 모바일 UI 개선 - 성경 구절 폰트 사이즈 축소(3xl->xl) 및 '새 생명의 시작' 섹션 타이틀 2단 분리(줄바꿈) 적용.

13\.

- **Date**: 2025-12-26 20:10:00
- **Commit Hash**: `af2e16f`
- **Summary**: UI 최종 개선 - Tree 페이지 모바일 타이틀 2단 분리 및 영문명 스타일 분리기, Mom 페이지 모바일 타이틀 폰트 최적화, 모바일 메뉴(Photo) 기본 닫힘 및 토글 로직 구현.

12\.

- **Date**: 2025-12-26 20:00:00
- **Commit Hash**: `d95e268`
- **Summary**: 모바일 반응형 디자인 최적화 - Photo 페이지의 타이틀 및 갤러리 섹션 간 여백(Padding/Margin)을 대폭 축소하여 가독성 개선 (Desktop 레이아웃 유지).

11\.

- **Date**: 2025-12-26 19:50:00
- **Commit Hash**: `ed212b7`
- **Summary**: PWA(Progressive Web App) 설정 추가 - 모바일 '홈 화면에 추가' 시 앱 아이콘(Favicon 기반) 및 Manifest.json 적용 완료.

10\.

- **Date**: 2025-12-26 19:00:00
- **Commit Hash**: `de2399d`
- **Summary**: UI 기능 개선 - 모든 페이지(Landing, Tree, Story, Donates, Manager)에 "위로가기(Scroll To Top)" 버튼 적용 및 중복 코드 통합 관리.

9\.

- **Date**: 2025-12-26 18:15:00
- **Commit Hash**: `1eb7200`
- **Summary**: 파비콘(Favicon) 수정 - Next.js App Router 표준 방식(src/app/icon.png)을 적용하여 브라우저 인식 문제 근본 해결.

8\.

- **Date**: 2025-12-26 18:05:00
- **Commit Hash**: `1eb7200`
- **Summary**: 갤러리/스토리지 최적화 - 이미지 업로드 시 클라이언트 측 자동 압축 로직 활성화 (Max Width: 1200px, Quality: 0.8).

7\.

- **Date**: 2025-12-26 17:55:00
- **Commit Hash**: `1eb7200`
- **Summary**: 갤러리 에디터 UI 수정 - 불필요한 LocalStorage 용량 제한 표시(5MB)를 제거하고 Cloud Storage 사용 안내로 변경.

6\.

- **Date**: 2025-12-26 17:30:00
- **Commit Hash**: `1eb7200`
- **Summary**: 관리자 모달 레이아웃 버그 수정 - React Portal을 적용하여 헤더 영역 잘림 현상 해결 및 전체 화면 백그라운드 클릭 동작 보장.

5\.

- **Date**: 2025-12-26 17:05:00
- **Commit Hash**: `1eb7200`
- **Summary**: 관리자 로그인 모달 UX 개선 - 닫기(X) 버튼 추가 및 백그라운드 클릭 시 닫힘 기능 구현.

4\.

- **Date**: 2025-12-26 16:35:00
- **Commit Hash**: `1eb7200`
- **Summary**: 관리자 보안 및 데이터 관리 기능 추가 - Manager 접속 비밀번호(Simple Auth) 구현, 데이터 JSON 백업/복구, 관리자 비밀번호 변경 기능 구현.

3\.

- **Date**: 2025-12-26 14:53:05
- **Commit Hash**: `6db1f8d5297135731e30ae3d1d2431de977052f3`
- **Summary**: 보안 강화 - Firebase API 키를 코드에서 환경 변수(.env)로 이동하여 GitHub 노출 방지.

2\.

- **Date**: 2025-12-26 13:43:33
- **Commit Hash**: `6cecc03ba43f4a88236bbe3e327eda07a67c0cee`
- **Summary**: Firebase Firestore/Storage 통합, Story 업로드 로직 수정(자동 업로드/안전장치) 및 관리자 페이지 한글화, 로컬 이미지 정리 완료.

1\.

- **Date**: 2025-12-25 18:03:24
- **Commit Hash**: `8a6eb20ae4d0c51c2d98409d6b724714aa29c871`
- **Summary**: family site 초기 설정(Next.js, 주요 기능 및 디렉토리 구조, 정적 자산 추가) 완료.
