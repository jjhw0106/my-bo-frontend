# Frontend 아키텍쳐
# Nuxt 3 Modern Front-End Architecture Guide

## 1. 프로젝트 개요 (Overview)
이 문서는 **Vue 3 + Nuxt 3 + Composition API**를 기반으로 한 프론트엔드 아키텍처 설계 원칙을 정의한다.
**유지보수성(Maintainability)**, **확장성(Scalability)**, **재사용성(Reusability)**을 최우선 목표로 하며, 백엔드(Spring Boot)와의 협업을 고려하여 설계되었다.

---

## 2. 디렉토리 구조 (Directory Structure)
관심사의 분리(Separation of Concerns)를 위해 UI, 비즈니스 로직, 페이지 라우팅을 명확히 구분한다.

```text
my-nuxt-app/
├── components/          # 컴포넌트 (재사용성 중심 분리)
│   ├── base/            # [UI] 비즈니스 로직이 없는 순수 디자인 컴포넌트 (Button, Input)
│   ├── domain/          # [Biz] 특정 기능에 종속된 복합 컴포넌트 (LoginForm, ProductCard)
│   └── layout/          # 레이아웃 전용 컴포넌트 (Header, Sidebar, Footer)
├── composables/         # 비즈니스 로직 및 API 호출 (Service/Repository 역할)
├── layouts/             # 페이지 레이아웃 템플릿
├── middleware/          # 라우팅 가드 (권한 체크)
├── pages/               # 실제 화면 (라우팅 엔트리 포인트)
├── stores/              # 전역 상태 관리 (Pinia)
└── types/               # TypeScript 인터페이스 및 타입 정의
```

---

## 3. 핵심 아키텍처 전략

### 3.1. 레이아웃 시스템 (Layout Strategy)
모든 페이지에 공통된 네비게이션(Nav)을 적용하되, 사이드바(Sidebar) 유무에 따라 레이아웃을 교체하는 방식을 사용한다.

* **Default Layout (`layouts/default.vue`)**:
    * **구성**: Top Navbar + Content
    * **용도**: 메인 페이지, 소개 페이지 등 넓은 화면이 필요한 곳.
* **Dashboard Layout (`layouts/dashboard.vue`)**:
    * **구성**: Top Navbar + **Side Navbar** + Content
    * **용도**: 관리자 페이지, 마이 페이지 등 메뉴 이동이 잦은 곳.

### 3.2. 인증 및 권한 관리 (Authentication & Security)
페이지 단위로 `if`문을 쓰지 않고, Nuxt의 **Middleware**를 통해 진입 시점에 권한을 제어한다.

* **구현 방식**: `middleware/auth.ts` 작성
* **적용**: 페이지 메타데이터(`definePageMeta`)를 통해 설정.
    ```typescript
    // pages/admin/index.vue
    definePageMeta({
      middleware: ['auth'], // 로그인한 유저만 접근 가능
      layout: 'dashboard'   // 사이드바가 있는 레이아웃 적용
    });
    ```

### 3.3. 컴포넌트 설계 (Component Design)
컴포넌트는 역할에 따라 엄격하게 분리하여 '스파게티 코드'를 방지한다.

| 구분 | 경로 | 역할 | 특징 |
| :--- | :--- | :--- | :--- |
| **Base** | `components/base` | 순수 UI 렌더링 | 상태(State) 없음, API 호출 금지, Props로만 데이터 수신 |
| **Domain** | `components/domain` | 기능 단위 구현 | Base 컴포넌트 조합, API 호출 수행, 비즈니스 로직 포함 |
| **Layout** | `components/layout` | 뼈대 구성 | 헤더, 푸터, 사이드바 등 레이아웃 전용 |

### 3.4. 비즈니스 로직 분리 (Composables)
Vue 컴포넌트(`script setup`) 내부에는 UI 제어 로직만 남기고, 데이터 통신 및 복잡한 계산 로직은 `composables`로 추출한다. (Java의 Service 계층과 유사)

* **예시**: `useApi.ts`, `useAuth.ts`
* Vue의 `Auto-import` 기능을 활용하여 별도 import 구문 없이 사용.

---

## 4. 기술 스택 (Tech Stack)
* **Core**: Nuxt 3, Vue 3 (Composition API)
* **Language**: TypeScript
* **State Management**: Pinia (Vuex 대체)
* **Styling**: Tailwind CSS (권장)
* **Package Manager**: npm




# 디자인 시스템 & UI 스타일 가이드 (기존 Next.js 프로젝트 추출)

## 1. 핵심 테마 아이덴티티
- **스타일 명칭:** 프리미엄 다크 글래스모피즘 (Premium Dark Glassmorphism)
- **기본 모드:** 다크 모드 (CSS 변수가 기본적으로 다크 테마 값으로 설정됨)
- **배경:** 고정된 선형 그라디언트 배경 사용
  - `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`

## 2. 컬러 팔레트 (Tailwind CSS 변수)
모든 값은 HSL(색상, 채도, 명도) 포맷을 따릅니다.

### 기본 색상 (Primitive Colors)
- **Background** (배경): `222.2 84% 4.9%` (딥 블루/블랙)
- **Foreground** (텍스트): `210 40% 98%` (오프 화이트)
- **Primary** (메인/브랜드): `217.2 91.2% 59.8%` (브라이트 블루)
  - Primary 텍스트: `222.2 47.4% 11.2%` (어두운 파란색)
- **Secondary** (보조): `217.2 32.6% 17.5%` (뮤트 블루-그레이)
- **Muted** (비활성/배경): `217.2 32.6% 17.5%`
- **Accent** (강조): `217.2 32.6% 17.5%`
- **Destructive** (위험/삭제): `0 62.8% 30.6%` (레드)
- **Border** (테두리): `217.2 32.6% 17.5%`
- **Input** (입력창): `217.2 32.6% 17.5%`
- **Ring** (포커스 링): `224.3 76.3% 48%` (파란색)

### 테두리 둥글기 (Border Radius)
- **Default**: `0.5rem` (8px)
- **lg**: `0.5rem`
- **md**: `calc(0.5rem - 2px)`
- **sm**: `calc(0.5rem - 4px)`

## 3. UI 효과 및 컴포넌트

### 글래스모피즘 (Glassmorphism, `.glass-effect`)
카드, 모달, 컨테이너 등에 사용하여 반투명한 유리를 덧댄 듯한 효과를 줍니다.
```css
.glass-effect {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}
```

### 버튼 (Buttons)
- **Hover (마우스 올림)**: 살짝 위로 떠오르며(`translateY(-1px)`), 그림자가 생김(`box-shadow`).
- **Active (클릭)**: 원래 위치로 돌아옴(`translateY(0)`).
- **전환 효과 (Transition)**: 모든 변화는 0.2초(200ms) 동안 부드럽게 일어남.

### 입력창 (Inputs)
- **Focus (입력 중)**: 파란색 빛무리가 생김 (`box-shadow`로 glow 효과 구현).

## 4. 애니메이션 (Animations)

### 페이드 인 (`.animate-fade-in`)
- **동작**: 아래에서 위로 살짝 올라오며 투명도 0 -> 1
- **지속 시간**: 0.5초 (ease-out)

### 쉬머 효과 (`.animate-shimmer`)
- **동작**: 왼쪽에서 오른쪽으로 빛이 지나가는 듯한 로딩 효과
- **용도**: 스켈레톤 UI, 로딩 상태
- **지속 시간**: 2초 (무한 반복)

## 5. 글로벌 CSS 동작
- **부드러운 전환**: 모든 요소(`*`)에 색상, 배경, 위치 등의 변화가 생길 때 0.2초간 부드럽게 전환되도록 설정됨.
- **폰트 설정**: Inter 폰트 최적화 (`rlig`, `calt` 기능 활성화).

## 6. Nuxt 3 적용 계획 (권장 사항)
이 디자인을 Nuxt 3 프로젝트(`mybo-frontend`)에 적용하려면:
1.  **Tailwind CSS** 설치 및 설정.
2.  `tailwind.config.ts` 파일에 위의 CSS 변수(`colors`, `borderRadius` 등)를 `extend`로 추가.
3.  `assets/css/main.css`를 생성하여 위의 `:root` 변수와 `.glass-effect` 같은 유틸리티 클래스를 복사.
4.  `layouts/default.vue`를 만들어 전체 배경 그라디언트를 적용.
