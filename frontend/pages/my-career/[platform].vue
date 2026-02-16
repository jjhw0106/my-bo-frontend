<script setup lang="ts">
  import ScrapeButton from '~/components/domain/ScrapeButton.vue';
  import SubButton from '~/components/domain/SubButton.vue';
  import PlatformLoginModal from '~/components/domain/PlatformLoginModal.vue';
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

  const totalApplications = computed(() => historyData.value.length);
  const platformTotal = computed(() => filteredHistory.value.length);

  // 3. 페이지 진입 시 데이터 로드
  onMounted(async () => {
    const appUserId = localStorage.getItem('last_user_id');
    if (appUserId) {
      await fetchHistory(appUserId);
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
    const appUserId = localStorage.getItem('last_user_id') || 'temp_app_user';

    if (creds) {
      // 스크래핑 요청
      await scrapePlatform(appUserId, platformId.value, platformInfo.value.name, creds);
      
      // 조회: 항상 appUserId로 전체 내역 조회
      await fetchHistory(appUserId);
    }
  };

  const handleManualLogin = async () => {
    isModalOpen.value = false;
    const appUserId = localStorage.getItem('last_user_id') || 'temp_app_user';
    await scrapePlatform(appUserId, platformId.value, platformInfo.value.name);
    // 조회: 항상 appUserId로 전체 내역 조회
    await fetchHistory(appUserId);
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
        <SubButton 
          label="엑셀 다운로드"
          :disabled="filteredHistory.length === 0"
          @click="excelDownload"
        />
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="glass-effect p-6 rounded-2xl border border-gray-800 space-y-2">
        <p class="text-gray-400 text-sm">{{ platformInfo.name }} 지원 건수</p>
        <p class="text-4xl font-bold text-white">{{ platformTotal }} <span class="text-base font-normal text-gray-500">건</span></p>
      </div>
      <div class="glass-effect p-6 rounded-2xl border border-gray-800 space-y-2">
        <p class="text-gray-400 text-sm">전체 플랫폼 총 지원 건수</p>
        <p class="text-4xl font-bold text-white">{{ totalApplications }} <span class="text-base font-normal text-gray-500">건</span></p>
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

    <PlatformLoginModal 
      :is-open="isModalOpen" 
      :platforms="[{ id: platformId, name: platformInfo.name }]" 
      @close="isModalOpen = false"
      @submit="handleLoginSubmit"
      @manual-login="handleManualLogin"
    />
  </div>
</template>
