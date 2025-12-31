<script setup lang="ts">
interface Platform {
  id: string;
  name: string;
}

const props = defineProps<{
  isOpen: boolean;
  platforms: Platform[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', credentials: Record<string, { id: string; pw: string }>): void;
  (e: 'manual-login', platformId: string): void; // 직접 로그인 이벤트 추가
}>();

// 플랫폼별 자격 증명 상태 관리
const credentials = ref<Record<string, { id: string; pw: string }>>({});

// 모달이 열릴 때 초기화
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    const initial: Record<string, { id: string; pw: string }> = {};
    props.platforms.forEach(p => {
      initial[p.id] = { id: '', pw: '' };
    });
    credentials.value = initial;
  }
});

const handleSubmit = () => {
  const isValid = Object.values(credentials.value).every(c => c.id && c.pw);
  if (!isValid) {
    alert('모든 플랫폼의 계정 정보를 입력해주세요.');
    return;
  }
  emit('submit', credentials.value);
};

// 단일 플랫폼일 경우 직접 로그인 버튼 활성화를 위한 헬퍼
const isSinglePlatform = computed(() => props.platforms.length === 1);
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')"></div>

      <!-- Modal Content -->
      <div class="relative w-full max-w-lg glass-effect rounded-3xl border border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <!-- Header -->
        <div class="px-8 py-6 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-white">데이터 동기화 로그인</h2>
            <p class="text-sm text-gray-400 mt-1">플랫폼 계정 정보를 입력하여 동기화를 시작합니다.</p>
          </div>
          <button @click="emit('close')" class="text-gray-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="px-8 py-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div class="space-y-8">
            <div v-for="platform in platforms" :key="platform.id" class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-6 bg-blue-600 rounded-full"></div>
                  <h3 class="font-semibold text-lg text-white">{{ platform.name }}</h3>
                </div>
                <!-- 직접 로그인 버튼 (단일 플랫폼일 때만 표시하거나, 각 플랫폼별로 표시) -->
                <button 
                  v-if="isSinglePlatform"
                  @click="emit('manual-login', platform.id)"
                  class="text-xs text-blue-400 hover:text-blue-300 underline decoration-dashed underline-offset-4"
                >
                  브라우저 직접 띄우기 ↗
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs text-gray-500 ml-1">아이디</label>
                  <input 
                    v-model="credentials[platform.id].id"
                    type="text" 
                    placeholder="ID"
                    class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white text-sm"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-500 ml-1">비밀번호</label>
                  <input 
                    v-model="credentials[platform.id].pw"
                    type="password" 
                    placeholder="Password"
                    class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-8 py-6 bg-gray-900/30 border-t border-gray-800 flex flex-col gap-3">
          <div class="flex gap-3">
             <button 
                @click="emit('close')"
                class="flex-1 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors font-semibold"
              >
                취소
              </button>
              <button 
                @click="handleSubmit"
                class="flex-[2] px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
              >
                입력 정보로 동기화
              </button>
          </div>
          
          <!-- 다중 플랫폼일 때의 안내 -->
          <p v-if="!isSinglePlatform" class="text-center text-xs text-gray-500 mt-2">
            * 전체 동기화 시에는 자동 로그인만 지원됩니다. 직접 로그인이 필요한 경우 개별 플랫폼 페이지를 이용해주세요.
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
</style>