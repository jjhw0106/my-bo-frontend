<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue';
import AppSidebar from '~/components/layout/AppSidebar.vue';

const route = useRoute();

// 메뉴 정의 (계층 구조 적용)
const myCareerMenuItems = [
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
  myCareerMenuItems.forEach(item => {
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
  for (const item of myCareerMenuItems) {
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
  <div class="flex flex-col h-screen text-gray-100 overflow-hidden bg-background">
    
    <AppHeader class="shrink-0 z-[100]" />

    <div class="flex flex-1 overflow-hidden pt-16">
      
      <AppSidebar :menuItems="myCareerMenuItems" class="fixed left-0 top-16 bottom-0" />

      <div class="flex-1 flex flex-col overflow-hidden md:pl-64">
        
        <main class="flex-1 p-8 pt-6 overflow-y-auto custom-scrollbar">
          <slot />
        </main>

      </div>
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
