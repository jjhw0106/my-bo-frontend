<script setup lang="ts">
  import ScrapeButton from '~/components/domain/ScrapeButton.vue';
  import LoginModal from '~/components/domain/LoginModal.vue';
  import { onMounted, computed } from 'vue';

  const route = useRoute();
  const { isScraping, scrapePlatform, fetchHistory, historyData } = useScraper();

  // 1. 플랫폼 정보 설정
  const platformMap: Record<string, any> = {
    wanted: { name: '원티드', color: 'blue', icon: 'W' },
    jobkorea: { name: '잡코리아', color: 'indigo', icon: 'J' },
    saramin: { name: '사람인', color: 'orange', icon: 'S' },
    rallit: { name: '랠릿', color: 'green', icon: 'R' }
  };

  const platformId = computed(() => route.params.platform as string);
  const platformInfo = computed(() => platformMap[platformId.value] || { name: 'Unknown', color: 'gray', icon: '?' });

  // 2. 데이터 필터링 (현재 플랫폼 데이터만)
  const filteredHistory = computed(() => {
    return historyData.value.filter((item: any) => item.platform === platformId.value);
  });

  // 3. 페이지 진입 시 데이터 로드
  onMounted(async () => {
    const savedId = localStorage.getItem('last_user_platform_id');
    if (savedId) {
      console.log('기억된 아이디로 조회 시작:', savedId);
      await fetchHistory(savedId);
    }
  });

  definePageMeta({
    layout: 'dashboard'
  });

  // 4. 모달 및 스크래핑 핸들러
  const isModalOpen = ref(false);

  const handleScrapingClick = () => {
    isModalOpen.value = true;
  };

  const handleLoginSubmit = async (credentialsMap: Record<string, { id: string; pw: string }>) => {
    isModalOpen.value = false;
    const creds = credentialsMap[platformId.value];
    if (creds) {
      // 스크래핑 요청
      await scrapePlatform(platformId.value, platformInfo.value.name, creds);
      // 성공 시 해당 아이디를 로컬스토리지에 저장 (useScraper 내부에서 처리하도록 함)
      localStorage.setItem('last_user_platform_id', creds.id);
      // 즉시 다시 조회
      await fetchHistory(creds.id);
    }
  };

  const handleManualLogin = async () => {
    isModalOpen.value = false;
    await scrapePlatform(platformId.value, platformInfo.value.name);
    const savedId = localStorage.getItem('last_user_platform_id');
    if (savedId) await fetchHistory(savedId);
  };

  const excelDownload = () => {
    useExcel().downloadAsExcel(filteredHistory.value, '지원현황');
  } 
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-900/20">
          {{ platformInfo.icon }}
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white">{{ platformInfo.name }} 지원 현황</h1>
          <p class="text-gray-400 mt-1">플랫폼에서 수집된 최신 지원 내역입니다.</p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <ScrapeButton 
          :platform-id="platformId" 
          :platform-info="platformInfo" 
          :is-scraping="isScraping" 
          @click="handleScrapingClick" 
        />
        <button 
          @click="excelDownload"
          :disabled="filteredHistory.length === 0"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          엑셀 다운로드
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div v-if="filteredHistory.length > 0" class="glass-effect rounded-2xl border border-gray-800 overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-gray-900/50 text-gray-400 font-semibold uppercase text-xs">
          <tr>
            <th class="px-6 py-4">지원일</th>
            <th class="px-6 py-4">회사명</th>
            <th class="px-6 py-4">포지션</th>
            <th class="px-6 py-4">상태</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800 text-gray-300">
          <tr v-for="item in filteredHistory" :key="item._id" class="hover:bg-gray-800/30">
            <td class="px-6 py-4">{{ item.appliedAt }}</td>
            <td class="px-6 py-4 text-white font-medium">{{ item.company }}</td>
            <td class="px-6 py-4">{{ item.position }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded-md bg-gray-800 text-xs">{{ item.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="glass-effect p-12 rounded-2xl border border-gray-800 text-center space-y-4">
      <p class="text-gray-400">수집된 데이터가 없습니다. 상단 버튼을 눌러 스크래핑을 시작해 주세요.</p>
    </div>

    <LoginModal 
      :is-open="isModalOpen" 
      :platforms="[{ id: platformId, name: platformInfo.name }]" 
      @close="isModalOpen = false"
      @submit="handleLoginSubmit"
      @manual-login="handleManualLogin"
    />
  </div>
</template>
