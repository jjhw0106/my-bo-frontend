<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
});

// 상태 관리
const isScraping = ref(false);

const runScraper = () => {
  isScraping.value = true;
  // TODO: Playwright MCP 호출 로직 연동
  setTimeout(() => {
    isScraping.value = false;
    alert('모든 채용 사이트에서 최신 데이터를 가져왔습니다.');
  }, 2500);
};

// 샘플 데이터: 플랫폼별 상태
const platforms = ref([
  { id: 'wanted', name: '원티드', status: 'connected', count: 12, icon: 'https://image.wanted.co.kr/optimize?src=https%3A%2F%2Fstatic.wanted.co.kr%2Ffavicon%2F144x144.png&w=64&q=75' },
  { id: 'jobkorea', name: '잡코리아', status: 'connected', count: 8, icon: 'https://www.jobkorea.co.kr/favicon.ico' },
  { id: 'saramin', name: '사람인', status: 'error', count: '-', icon: 'https://www.saramin.co.kr/favicon.ico' }
]);

// 샘플 데이터: 지원 내역
const applications = ref([
  { id: 101, company: '비바리퍼블리카 (Toss)', role: 'Frontend Developer', platform: '원티드', status: '서류통과', date: '2025.12.24' },
  { id: 102, company: '당근마켓', role: 'Software Engineer', platform: '원티드', status: '지원완료', date: '2025.12.23' },
  { id: 103, company: '우아한형제들', role: 'Web Front-end', platform: '잡코리아', status: '열람', date: '2025.12.22' },
  { id: 104, company: '쿠팡', role: 'UX Engineer', platform: '사람인', status: '불합격', date: '2025.12.20' },
  { id: 105, company: '네이버', role: 'Platform Tech', platform: '잡코리아', status: '면접대기', date: '2025.12.18' }
]);

// 상태에 따른 배지 스타일
const getStatusClass = (status: string) => {
  switch (status) {
    case '서류통과': return 'text-green-400 bg-green-900/30 border-green-800';
    case '면접대기': return 'text-blue-400 bg-blue-900/30 border-blue-800';
    case '불합격': return 'text-red-400 bg-red-900/30 border-red-800';
    default: return 'text-gray-400 bg-gray-800 border-gray-700';
  }
};
</script>

<template>
  <div class="space-y-8">
    <!-- 1. Header & Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">Career Dashboard</h1>
        <p class="text-gray-400 mt-1">
          모든 채용 플랫폼의 지원 내역을 이곳에서 한눈에 관리하세요.
        </p>
      </div>
      
      <button 
        @click="runScraper"
        :disabled="isScraping"
        class="group relative flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.4)]"
      >
        <span v-if="isScraping" class="animate-spin text-lg">↻</span>
        <span v-else class="text-lg group-hover:scale-110 transition-transform">⚡</span>
        <span>{{ isScraping ? '데이터 동기화 중...' : '전체 동기화 실행' }}</span>
      </button>
    </div>

    <!-- 2. Platform Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="pf in platforms" :key="pf.id" class="glass-effect p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden group">
        <!-- Background Glow -->
        <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2 shadow-lg z-10">
          <!-- 실제 아이콘 대신 텍스트로 대체 (CORS 등 이미지 이슈 방지) -->
           <span class="text-black font-bold text-xs">{{ pf.name.substring(0, 2) }}</span>
        </div>
        
        <div class="flex-1 z-10">
          <div class="flex justify-between items-start">
            <h3 class="font-semibold text-lg text-gray-100">{{ pf.name }}</h3>
            <span v-if="pf.status === 'connected'" class="flex h-2.5 w-2.5 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span v-else class="h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </div>
          <p class="text-sm text-gray-400 mt-1">
            {{ pf.status === 'connected' ? `최근 지원: ${pf.count}건` : '연동 확인 필요' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 3. Application List Table -->
    <div class="glass-effect rounded-2xl border border-gray-800 overflow-hidden">
      <div class="p-6 border-b border-gray-800 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-white">최근 지원 현황</h2>
        <button class="text-sm text-blue-400 hover:text-blue-300 transition-colors">전체 보기 &rarr;</button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-900/50 text-gray-400 uppercase tracking-wider font-medium">
            <tr>
              <th class="px-6 py-4">회사명</th>
              <th class="px-6 py-4">지원 포지션</th>
              <th class="px-6 py-4">플랫폼</th>
              <th class="px-6 py-4">상태</th>
              <th class="px-6 py-4 text-right">지원 날짜</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr v-for="app in applications" :key="app.id" class="hover:bg-white/5 transition-colors group">
              <td class="px-6 py-4 font-medium text-white group-hover:text-blue-200 transition-colors">
                {{ app.company }}
              </td>
              <td class="px-6 py-4 text-gray-300">
                {{ app.role }}
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                  {{ app.platform }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border" :class="getStatusClass(app.status)">
                  {{ app.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right text-gray-500 tabular-nums">
                {{ app.date }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State (데이터 없을 때) -->
      <div v-if="applications.length === 0" class="p-12 text-center text-gray-500">
        표시할 지원 내역이 없습니다. 동기화를 진행해주세요.
      </div>
    </div>
  </div>
</template>