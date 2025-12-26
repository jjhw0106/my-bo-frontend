<script setup lang="ts">
const route = useRoute();

// 메뉴 정의 (계층 구조 적용)
const menuItems = [
  { 
    name: 'My Career', 
    path: '/my-career', // 상위 경로는 children이 있을 경우 토글 용도로 사용됨
    icon: '💼', // Briefcase
    children: [
      { name: 'Overview', path: '/my-career/overview' },
      { name: 'Wanted', path: '/my-career/wanted' },
      { name: 'JobKorea', path: '/my-career/jobkorea' },
      { name: 'Saramin', path: '/my-career/saramin' },
    ]
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: '⚙️' // Gear
  }
];

// 메뉴 확장 상태 관리 (Open/Close)
// 초기값: 현재 경로가 포함된 메뉴는 열어둠
const expandedMenus = ref<Record<string, boolean>>({});

// 초기 로딩 시 현재 경로에 맞는 메뉴 열기
const initExpandedMenu = () => {
  menuItems.forEach(item => {
    if (item.children && route.path.startsWith(item.path)) {
      expandedMenus.value[item.name] = true;
    }
  });
};

// 라우트 변경 감지하여 자동으로 메뉴 열기 (선택 사항 - 원하지 않으면 제거 가능)
watch(() => route.path, () => {
  initExpandedMenu();
}, { immediate: true });


// 토글 함수
const toggleMenu = (itemName: string) => {
  expandedMenus.value[itemName] = !expandedMenus.value[itemName];
};

// 현재 페이지 타이틀 계산 (Recursive)
const pageTitle = computed(() => {
  for (const item of menuItems) {
    // 1. 하위 메뉴 매칭 확인
    if (item.children) {
      const activeChild = item.children.find(child => route.path === child.path); // 정확히 일치 우선
      if (activeChild) return `${item.name} > ${activeChild.name}`;
      
      // 하위 경로 매칭 (overview 등)
      if (route.path.startsWith(item.path)) {
         // 현재 경로가 /my-career/wanted 인데 child.path가 /my-career/wanted 라면 매칭
         const deepChild = item.children.find(child => route.path.startsWith(child.path));
         if(deepChild) return `${item.name} > ${deepChild.name}`;
         return item.name;
      }
    }
    // 2. 상위 메뉴 매칭 확인
    if (route.path.startsWith(item.path) && item.path !== '/') {
      return item.name;
    }
  }
  return 'Dashboard';
});

// 활성 상태 확인 헬퍼
const isActive = (path: string) => route.path.startsWith(path);
const isExactActive = (path: string) => route.path === path;
</script>

<template>
  <div class="min-h-screen flex text-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-[hsl(var(--border))] glass-effect hidden md:flex flex-col">
      <div class="h-16 flex items-center px-6 border-b border-[hsl(var(--border))]">
        <span class="font-bold text-xl text-[hsl(var(--primary))]">Dashboard</span>
        <NuxtLink to="/" class="ml-auto p-1.5 rounded-md hover:bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </NuxtLink>
      </div>
      
      <nav class="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div v-for="item in menuItems" :key="item.name">
          
          <!-- Case 1: 하위 메뉴가 있는 경우 (Parent Item) -->
          <div v-if="item.children">
            <button 
              @click="toggleMenu(item.name)"
              class="w-full flex items-center justify-between p-2 rounded-lg transition-colors group select-none"
              :class="isActive(item.path) ? 'text-[hsl(var(--primary))]' : 'text-gray-400 hover:bg-[hsl(var(--accent))] hover:text-white'"
            >
              <div class="flex items-center gap-3">
                <span>{{ item.icon }}</span>
                <span class="font-medium">{{ item.name }}</span>
              </div>
              <span class="text-xs transition-transform duration-200" :class="expandedMenus[item.name] ? 'rotate-180' : ''">
                ▼
              </span>
            </button>

            <!-- Submenu Items (Accordion) -->
            <div 
              v-show="expandedMenus[item.name]"
              class="mt-1 ml-4 pl-4 border-l border-gray-700 space-y-1 overflow-hidden transition-all"
            >
              <NuxtLink 
                v-for="child in item.children" 
                :key="child.path"
                :to="child.path"
                class="block p-2 text-sm rounded-lg transition-colors"
                :class="isExactActive(child.path) 
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium' 
                  : 'text-gray-400 hover:text-white hover:bg-[hsl(var(--accent))]'"
              >
                {{ child.name }}
              </NuxtLink>
            </div>
          </div>

          <!-- Case 2: 하위 메뉴가 없는 경우 (Single Item) -->
          <NuxtLink 
            v-else
            :to="item.path"
            class="flex items-center gap-3 p-2 rounded-lg transition-colors"
            :class="isActive(item.path) 
              ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium' 
              : 'text-gray-400 hover:bg-[hsl(var(--accent))] hover:text-white'"
          >
            <span>{{ item.icon }}</span>
            <span class="font-medium">{{ item.name }}</span>
          </NuxtLink>

        </div>
      </nav>
    </aside>

    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Top Navbar -->
      <header class="h-16 border-b border-[hsl(var(--border))] glass-effect flex items-center px-6 sticky top-0 z-50 justify-between shrink-0">
        <h2 class="font-semibold text-lg text-[hsl(var(--foreground))]">{{ pageTitle }}</h2>
        <div class="flex items-center gap-4">
           <!-- User Profile -->
           <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600"></div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* 커스텀 스크롤바 */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
