# Mikrokosmos — 1차 프론트엔드 UI 구현 계획

> **목표:** SPEC.md 기반으로 인터랙티브한 우주 인터페이스를 구현하여, 사용자가 별(Star)을 생성·탐색·기록하는 핵심 경험을 프론트엔드에서 완성한다.
> 백엔드 없이 **목 데이터(Mock Data)** 기반으로 동작하는 인터랙티브 프론트엔드를 먼저 구축한다.

---

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| 프레임워크 | **Next.js** (App Router) |
| 언어 | **TypeScript** |
| 스타일링 | **Tailwind CSS** |
| 3D 렌더링 | **Three.js** + **@react-three/fiber** + **@react-three/drei** |
| 상태관리 | **Zustand** |
| 애니메이션 | **Framer Motion** (2D UI) / Three.js Shader (3D) |

---

## Phase 1 구현 범위

### 🎯 핵심 목표

1. **3D 우주 공간(Cosmos)** 렌더링 및 카메라 인터랙션
2. **별(Star) 오브젝트** 3가지 상태별 시각 표현
3. **별 생성 플로우** (테마 선택 → 문장 입력 → 우주에 배치)
4. **별 상세보기** (클릭 시 줌인 + 정보 패널)
5. **기록(Log) 추가** UI
6. **탐색(Explore)** 기본 카메라 이동

### ⏳ Phase 1에서 제외

- 사용자 인증 / 로그인
- 백엔드 API 연동
- 벡터 임베딩 기반 배치 (목 좌표 사용)
- 정교한 군집(Galaxy) 시각화
- 반응형 모바일 최적화 고도화

---

## 프로젝트 구조

```
mikrokosmos/
├── public/
│   └── fonts/                    # 커스텀 폰트
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   ├── page.tsx              # 랜딩 → 우주 진입
│   │   ├── cosmos/
│   │   │   └── page.tsx          # 메인 우주 뷰
│   │   └── star/
│   │       └── [id]/
│   │           └── page.tsx      # 별 상세 페이지
│   ├── components/
│   │   ├── canvas/               # 3D Canvas 관련
│   │   │   ├── CosmosCanvas.tsx  # R3F Canvas 루트
│   │   │   ├── StarField.tsx     # 배경 별 필드
│   │   │   ├── StarObject.tsx    # 개별 별 3D 오브젝트
│   │   │   ├── CameraController.tsx  # 카메라 이동/줌
│   │   │   └── CosmosEnvironment.tsx # 조명, 안개, 포스트프로세싱
│   │   ├── ui/                   # 2D 오버레이 UI
│   │   │   ├── StarCreateModal.tsx   # 별 생성 모달
│   │   │   ├── StarDetailPanel.tsx   # 별 상세 패널
│   │   │   ├── LogEntryForm.tsx      # 기록 입력 폼
│   │   │   ├── NavigationHUD.tsx     # 네비게이션 HUD
│   │   │   ├── ThemeSelector.tsx     # 테마 선택 UI
│   │   │   └── LandingOverlay.tsx    # 랜딩 오버레이
│   │   └── shared/               # 공통 컴포넌트
│   │       ├── Button.tsx
│   │       └── Modal.tsx
│   ├── stores/                   # Zustand 스토어
│   │   ├── useCosmosStore.ts     # 우주 상태 (카메라, 뷰 모드)
│   │   └── useStarStore.ts       # 별 데이터 관리
│   ├── data/                     # 목 데이터
│   │   └── mockStars.ts          # 샘플 별 데이터
│   ├── types/                    # TypeScript 타입
│   │   └── index.ts
│   ├── utils/                    # 유틸리티
│   │   ├── starNameGenerator.ts  # 카탈로그형 이름 생성
│   │   └── starVisuals.ts       # 상태별 비주얼 계산
│   └── shaders/                  # GLSL 셰이더
│       ├── starGlow.vert
│       └── starGlow.frag
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 상세 구현 계획

### 1. 프로젝트 초기화 및 환경 설정

- `npx create-next-app@latest` 으로 Next.js 프로젝트 생성 (TypeScript, Tailwind CSS, App Router)
- 추가 패키지 설치:
  ```
  three @react-three/fiber @react-three/drei @react-three/postprocessing
  zustand framer-motion
  @types/three
  ```
- Tailwind 커스텀 테마 (우주 컬러 팔레트, 폰트 설정)
- 글로벌 CSS에 우주 배경 기본 스타일 적용

---

### 2. 타입 시스템 (`types/index.ts`)

```typescript
// 핵심 타입 정의
type StarTheme = 'dream' | 'goal' | 'wish' | 'hope'
type StarStatus = 'active' | 'dying' | 'archived'
type BrightnessStage = 'protostar' | 'young' | 'mainSequence' | 'giant' | 'supergiant'

interface Star {
  id: string
  catalogName: string        // "HD 284921"
  theme: StarTheme
  title: string              // 사용자 의미 이름
  initialText: string        // 초기 문장
  status: StarStatus
  brightnessStage: BrightnessStage
  position: [number, number, number]  // 3D 좌표
  logs: Log[]
  createdAt: Date
  archivedAt?: Date
}

interface Log {
  id: string
  text: string
  createdAt: Date
}
```

---

### 3. 3D 우주 캔버스 (`CosmosCanvas`)

#### 핵심 구현
- `@react-three/fiber`의 `<Canvas>` 로 3D 씬 구성
- **배경 별 필드 (StarField):** 수천 개의 작은 파티클로 우주 배경 구성 (Points + BufferGeometry)
- **안개 / 네뷸라 효과:** 깊이감을 위한 cosmic dust 표현
- **포스트 프로세싱:** Bloom, Vignette 효과로 발광 표현

#### 카메라 컨트롤러 (`CameraController`)
- **패닝:** 마우스 드래그로 우주 공간 이동
- **줌:** 스크롤로 줌인/줌아웃 (별 클릭 시 자동 줌인)
- **부드러운 전환:** `drei`의 `CameraControls` 또는 직접 lerp 구현
- **줌 범위 제한:** 최소/최대 줌 레벨 설정

---

### 4. 별 렌더링 시스템 (`StarObject`)

#### 테마별 색상 매핑
| 테마 | 기본 색상 | HSL 기준 |
| --- | --- | --- |
| 꿈(dream) | 따뜻한 노랑 | `hsl(45, 95%, 65%)` |
| 목표(goal) | 화이트 골드 | `hsl(40, 80%, 80%)` |
| 소원(wish) | 코발트 블루 | `hsl(220, 85%, 60%)` |
| 바람(hope) | 보라-청록 | `hsl(280, 70%, 65%)` |

#### 상태별 렌더링

**활성 별 (Active)**
- 선명한 테마 색상
- Pulse glow 애니메이션 (sin 기반 밝기 변화)
- 미세한 shimmering (noise 기반 불투명도 변화)
- 주변 glow 입자 (PointSprite)
- 크기: `brightnessStage`에 비례

**죽어가는 별 (Dying)**
- 색상 탈색 (saturation 감소)
- 불규칙 flicker (랜덤 밝기 변화)
- glow 범위 축소
- 붉은 기운 믹스 (hue shift → red)
- 크기 약간 축소

**흔적 별 (Archived)**
- 매우 낮은 밝기 (opacity 0.2~0.3)
- 성운형 잔광 (sprite texture)
- 거의 정적 (미세한 흔들림만)
- 먼지 입자 효과
- 탈색 컬러 (grayscale에 가까움)

#### 셰이더 구현
- 커스텀 GLSL vertex/fragment 셰이더로 glow 효과
- `uniform` 으로 `status`, `theme`, `stage` 전달
- 시간 기반 애니메이션 (`uTime`)

---

### 5. 별 생성 플로우 (`StarCreateModal`)

#### 단계별 UI (Framer Motion 트랜지션)

1. **테마 선택**
   - 4개 테마 카드 (꿈 / 목표 / 소원 / 바람)
   - 각 카드에 테마 색상 + 아이콘 + 설명
   - 선택 시 부드러운 확대 전환

2. **문장 입력**
   - 중앙 텍스트 입력 영역
   - 타이핑 시 배경에 별 파티클 생성 효과
   - 최소 글자 수 가이드

3. **별 생성 확인**
   - 생성될 카탈로그 이름 미리보기 (예: "HD 284921")
   - "이 별을 우주에 띄우시겠습니까?" 확인
   - 생성 시 우주에 새 별이 나타나는 애니메이션

---

### 6. 별 상세 패널 (`StarDetailPanel`)

#### 진입 방식
- 별 클릭 → 카메라 자동 줌인 → 사이드 패널 슬라이드인

#### 표시 정보
- 카탈로그 이름 + 사용자 제목
- 테마 뱃지
- 상태 표시 (활성 / 죽어가는 / 흔적)
- 성장 단계 시각화
- 초기 문장
- 기록 타임라인 (최신순)
- 생성일

#### 기록 추가 (`LogEntryForm`)
- 텍스트 입력 폼
- 기록 추가 시 별 밝기 순간 증가 효과
- 기록 카운트 표시

---

### 7. 상태 관리 (Zustand)

#### `useStarStore`
```
- stars: Star[]           // 전체 별 목록
- selectedStarId: string  // 선택된 별
- createStar()            // 별 생성
- addLog()                // 기록 추가
- archiveStar()           // 별 삭제 (→ 흔적 전환)
- getMyStars()            // 내 별 필터
```

#### `useCosmosStore`
```
- cameraTarget: Vector3   // 카메라 목표 위치
- zoomLevel: number       // 줌 레벨
- viewMode: 'explore' | 'detail' | 'create'
- setCameraTarget()
- setViewMode()
```

---

### 8. 네비게이션 HUD (`NavigationHUD`)

우주 화면 위 2D 오버레이 UI:
- **내 별 보기** 버튼 → 내 별 위치로 카메라 이동
- **별 생성** 버튼 (별 5개 미만일 때만 활성)
- **탐색 모드** 토글
- **현재 위치 / 줌 레벨** 인디케이터
- 미니맵 (선택적)

---

### 9. 랜딩 오버레이 (`LandingOverlay`)

서비스 첫 진입 시 표시:
- 서비스 제목 "Mikrokosmos" 타이포그래피
- 한 줄 설명 (세계관 메시지)
- "우주로 들어가기" CTA 버튼
- 버튼 클릭 시 오버레이 페이드아웃 + 우주 줌인 전환

---

### 10. 유틸리티

#### `starNameGenerator.ts`
- 접두사 풀: `['HD', 'HIP', 'GJ']`
- 뒤에 랜덤 4~6자리 숫자 조합
- 중복 방지 체크

#### `starVisuals.ts`
- 테마 → 색상 매핑
- 상태 → 비주얼 속성 매핑 (밝기, 크기, glow 범위, 색상 변조)
- 성장 단계 → 크기 스케일 매핑

---

## 구현 순서 (단계별)

| 순서 | 작업 | 우선순위 |
| --- | --- | --- |
| **Step 1** | 프로젝트 초기화 + Tailwind 설정 + 패키지 설치 | 🔴 필수 |
| **Step 2** | 타입 시스템 + 목 데이터 + Zustand 스토어 | 🔴 필수 |
| **Step 3** | 3D Canvas + 배경 별 필드 + 카메라 컨트롤 | 🔴 필수 |
| **Step 4** | 별 오브젝트 렌더링 (3가지 상태) | 🔴 필수 |
| **Step 5** | 랜딩 오버레이 (진입 화면) | 🟡 중요 |
| **Step 6** | 별 클릭 → 줌인 → 상세 패널 | 🔴 필수 |
| **Step 7** | 별 생성 모달 (3단계 플로우) | 🔴 필수 |
| **Step 8** | 기록 추가 UI + 별 상태 변화 반영 | 🟡 중요 |
| **Step 9** | 네비게이션 HUD | 🟡 중요 |
| **Step 10** | 포스트 프로세싱 + 셰이더 폴리싱 | 🟢 폴리싱 |

---

## 검증 계획

### 브라우저 테스트
- `npm run dev` 실행 후 `localhost:3000` 접속
- 랜딩 화면 → 우주 진입 전환 동작 확인
- 3D 우주 렌더링 및 배경 별 필드 표시 확인
- 마우스 드래그/스크롤로 카메라 이동/줌 인터랙션 확인
- 별 3가지 상태(활성/죽어가는/흔적)의 시각적 차이 확인
- 별 클릭 시 줌인 + 상세 패널 표시 확인
- 별 생성 플로우 (테마 선택 → 문장 입력 → 생성) 동작 확인
- 기록 추가 시 별 상태 반영 확인

### 빌드 검증
- `npm run build`로 프로덕션 빌드 성공 확인
- TypeScript 타입 에러 없음 확인

### 수동 검증 요청
- 전체 UI/UX 흐름을 사용자에게 시연 후 피드백 수집
