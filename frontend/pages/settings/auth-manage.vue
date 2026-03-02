<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
});

const { protectedRoutes, toggleRoute } = usePagePermissions();

// 앱에 존재하는 관리 가능한 라우트 목록
const managedRoutes = [
  { path: '/stocks', label: 'Stocks', icon: '📈' },
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/mypage', label: 'My Page', icon: '👤' },
  { path: '/admin', label: 'Admin', icon: '🔑' },
  { path: '/my-career', label: 'My Career', icon: '💼' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
  { path: '/lotto', label: 'Lotto', icon: '🎰' },
];

const isRouteProtected = (path: string) => {
  return protectedRoutes.value.includes(path);
};
</script>

<template>
  <div class="max-w-4xl space-y-8">

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-white">Auth Manage</h1>
      <p class="text-gray-400 mt-1">각 페이지의 로그인 필요 여부를 설정합니다.</p>
    </div>

    <!-- Route Permission List -->
    <section class="glass-effect rounded-2xl border border-gray-800 p-6 space-y-6">
      <div class="border-b border-gray-800 pb-4">
        <h2 class="text-xl font-semibold text-white">페이지별 접근 권한</h2>
        <p class="text-sm text-gray-400">토글을 켜면 해당 페이지에 접근 시 로그인이 필요합니다.</p>
      </div>

      <div class="space-y-2">
        <div
          v-for="route in managedRoutes"
          :key="route.path"
          class="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ route.icon }}</span>
            <div>
              <p class="font-medium text-gray-200">{{ route.label }}</p>
              <p class="text-xs text-gray-500 font-mono">{{ route.path }}</p>
            </div>
          </div>

          <!-- Toggle Switch -->
          <button
            @click="toggleRoute(route.path)"
            class="w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative"
            :class="isRouteProtected(route.path) ? 'bg-blue-600' : 'bg-gray-700'"
          >
            <div
              class="w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200"
              :class="isRouteProtected(route.path) ? 'translate-x-6' : 'translate-x-0'"
            ></div>
          </button>
        </div>
      </div>
    </section>

    <!-- Info -->
    <section class="glass-effect rounded-2xl border border-gray-800 p-6">
      <div class="flex items-start gap-3">
        <span class="text-xl">💡</span>
        <div>
          <p class="font-medium text-gray-200">안내</p>
          <p class="text-sm text-gray-400 mt-1">
            설정은 브라우저에 저장되며, 새로고침 후에도 유지됩니다.
            로그인이 필요한 페이지에 비로그인 상태로 접근하면 로그인 페이지로 이동합니다.
          </p>
        </div>
      </div>
    </section>

  </div>
</template>
