<script setup lang="ts">
const route = useRoute();

// 플랫폼별 데이터 매핑
const platformMap: Record<string, any> = {
  wanted: { name: '원티드', color: 'blue', icon: 'W' },
  jobkorea: { name: '잡코리아', color: 'indigo', icon: 'J' },
  saramin: { name: '사람인', color: 'orange', icon: 'S' },
  rallit: { name: '랠릿', color: 'green', icon: 'R' }
};

// URL 파라미터에서 플랫폼 ID 추출
const platformId = computed(() => route.params.platform as string);
const platformInfo = computed(() => platformMap[platformId.value] || { name: 'Unknown', color: 'gray', icon: '?' });

definePageMeta({
  layout: 'dashboard'
});

// 스크래핑 상태 관리
const isScraping = ref(false);

const handleScraping = async () => {
  isScraping.value = true;
  
  // TODO: Playwright MCP 또는 백엔드 스크래퍼 API 호출
  // 예: await $fetch(`/api/scrape/${platformId.value}`)
  
  setTimeout(() => {
    isScraping.value = false;
    alert(`${platformInfo.value.name}의 최신 지원 정보를 성공적으로 가져왔습니다.`);
  }, 3000);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
      <div class="flex items-center gap-4">
        <div 
          class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shrink-0 transition-transform hover:scale-105"
          :class="{
            'bg-blue-600 shadow-blue-900/20': platformId === 'wanted',
            'bg-indigo-600 shadow-indigo-900/20': platformId === 'jobkorea',
            'bg-orange-600 shadow-orange-900/20': platformId === 'saramin',
            'bg-green-600 shadow-green-900/20': platformId === 'rallit',
            'bg-gray-600': !['wanted', 'jobkorea', 'saramin', 'rallit'].includes(platformId)
          }"
        >
          {{ platformInfo.icon }}
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white flex items-center gap-2">
            {{ platformInfo.name }} 
            <span class="text-sm font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full capitalize">{{ platformId }}</span>
          </h1>
          <p class="text-gray-400 mt-1">{{ platformInfo.name }} 플랫폼에서의 지원 현황 및 이력을 관리합니다.</p>
        </div>
      </div>

      <!-- Scraping Action Button -->
      <button 
        @click="handleScraping"
        :disabled="isScraping"
        class="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        :class="{
          'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30': platformId === 'wanted',
          'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/30': platformId === 'jobkorea',
          'bg-orange-600 hover:bg-orange-500 shadow-orange-900/30': platformId === 'saramin',
          'bg-green-600 hover:bg-green-500 shadow-green-900/30': platformId === 'rallit',
          'bg-gray-700 hover:bg-gray-600': !['wanted', 'jobkorea', 'saramin', 'rallit'].includes(platformId)
        }"
      >
        <!-- Background Animation Effect -->
        <span v-if="isScraping" class="absolute inset-0 bg-white/10 animate-pulse"></span>
        
        <span v-if="isScraping" class="animate-spin text-xl">↻</span>
        <span v-else class="text-xl group-hover:rotate-12 transition-transform">🤖</span>
        
        <span>{{ isScraping ? `${platformInfo.name} 데이터 수집 중...` : `${platformInfo.name}에서 정보 가져오기` }}</span>
      </button>
    </div>

    <!-- Content Placeholder -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <!-- Stats Grid -->
       <div class="glass-effect p-6 rounded-2xl border border-gray-800 space-y-1">
          <p class="text-gray-400 text-sm">지원 완료</p>
          <p class="text-3xl font-bold text-white">-</p>
       </div>
       <div class="glass-effect p-6 rounded-2xl border border-gray-800 space-y-1">
          <p class="text-gray-400 text-sm">열람 확인</p>
          <p class="text-3xl font-bold text-white">-</p>
       </div>
       <div class="glass-effect p-6 rounded-2xl border border-gray-800 space-y-1">
          <p class="text-gray-400 text-sm">최종 업데이트</p>
          <p class="text-3xl font-bold text-white">N/A</p>
       </div>
    </div>

    <div class="glass-effect p-12 rounded-2xl border border-gray-800 text-center flex flex-col items-center justify-center space-y-4">
      <div class="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-4xl grayscale opacity-50">
        {{ platformInfo.icon }}
      </div>
      <div>
        <h2 class="text-xl font-semibold text-white mb-2">데이터가 아직 수집되지 않았습니다.</h2>
        <p class="text-gray-400 max-w-md">
          상단의 <b>'정보 가져오기'</b> 버튼을 클릭하여 {{ platformInfo.name }} 계정으로부터 지원 이력을 동기화해 주세요.
        </p>
      </div>
    </div>
  </div>
</template>