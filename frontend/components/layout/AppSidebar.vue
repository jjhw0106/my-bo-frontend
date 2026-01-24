<script setup lang="ts">
// 레이아웃에 있던 로직을 이쪽으로 옮깁니다.


const props =defineProps<{
  menuItems: Array<{
    name: string;
    path: string;
    icon?: string;
    children?: Array<{ name: string; path: string }>;
  }>
}>();

// const props = defineProps<{ menuItems: Array<{ name: string; path: string; icon?: string; children?: Array<{ name: string; path: string }> }> }>();

const route = useRoute();
const expandedMenus = ref<Record<string, boolean>>({});

const initExpandedMenu = () => {
    props.menuItems.forEach(item => {
        if (item.children && route.path.startsWith(item.path)) {
        expandedMenus.value[item.name] = true;
        }
    });
};

watch(() => route.path, () => initExpandedMenu(), { immediate: true });

const toggleMenu = (itemName: string) => {
  expandedMenus.value[itemName] = !expandedMenus.value[itemName];
};

const isActive = (path: string) => route.path.startsWith(path);
const isExactActive = (path: string) => route.path === path;
</script>

<template>
    <aside class="w-64 border-r border-[hsl(var(--border))] glass-effect hidden md:flex flex-col shrink-0">
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
                <span class="text-xs transition-transform duration-200" :class="expandedMenus[item.name] ? 'rotate-180' : ''">▼</span>
              </button>

              <div v-show="expandedMenus[item.name]" class="mt-1 ml-4 pl-4 border-l border-gray-700 space-y-1 overflow-hidden transition-all">
                <NuxtLink 
                  v-for="child in item.children" 
                  :key="child.path"
                  :to="child.path"
                  class="block p-2 text-sm rounded-lg transition-colors"
                  :class="isExactActive(child.path) ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium' : 'text-gray-400 hover:text-white hover:bg-[hsl(var(--accent))]'"
                >
                  {{ child.name }}
                </NuxtLink>
              </div>
            </div>

            <NuxtLink 
              v-else
              :to="item.path"
              class="flex items-center gap-3 p-2 rounded-lg transition-colors"
              :class="isActive(item.path) ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium' : 'text-gray-400 hover:bg-[hsl(var(--accent))] hover:text-white'"
            >
              <span>{{ item.icon }}</span>
              <span class="font-medium">{{ item.name }}</span>
            </NuxtLink>
          </div>
        </nav>
      </aside>
</template>