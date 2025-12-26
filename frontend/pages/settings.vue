<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
});

const { user, logout } = useAuth();
const isSaving = ref(false);

// 폼 데이터 (임시 상태)
const profile = ref({
  name: user.value?.name || 'User',
  email: user.value?.email || 'user@example.com',
  bio: 'Frontend Developer @ My Company'
});

const notifications = ref({
  email: true,
  push: false,
  marketing: false
});

const handleSave = () => {
  isSaving.value = true;
  // TODO: API 호출 시뮬레이션
  setTimeout(() => {
    isSaving.value = false;
    alert('설정이 저장되었습니다.');
  }, 1000);
};

const handleLogout = async () => {
  if (confirm('정말 로그아웃 하시겠습니까?')) {
    await logout();
  }
};
</script>

<template>
  <div class="max-w-4xl space-y-8">
    
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-white">Settings</h1>
      <p class="text-gray-400 mt-1">계정 정보 및 애플리케이션 환경을 설정합니다.</p>
    </div>

    <!-- 1. Profile Section -->
    <section class="glass-effect rounded-2xl border border-gray-800 p-6 space-y-6">
      <div class="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h2 class="text-xl font-semibold text-white">프로필 정보</h2>
          <p class="text-sm text-gray-400">서비스에 표시되는 내 공개 정보입니다.</p>
        </div>
        <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white">
          {{ profile.name.charAt(0) }}
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-300">이름</label>
          <input 
            v-model="profile.name" 
            type="text" 
            class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-300">이메일</label>
          <input 
            v-model="profile.email" 
            type="email" 
            disabled
            class="w-full px-4 py-2 bg-gray-900/30 border border-gray-800 rounded-lg text-gray-500 cursor-not-allowed"
          />
        </div>
        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium text-gray-300">소개 (Bio)</label>
          <textarea 
            v-model="profile.bio" 
            rows="3"
            class="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all resize-none"
          ></textarea>
        </div>
      </div>
      
      <div class="flex justify-end pt-2">
        <button 
          @click="handleSave" 
          :disabled="isSaving"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span v-if="isSaving" class="animate-spin">↻</span>
          {{ isSaving ? '저장 중...' : '변경사항 저장' }}
        </button>
      </div>
    </section>

    <!-- 2. Notification Section -->
    <section class="glass-effect rounded-2xl border border-gray-800 p-6 space-y-6">
      <div class="border-b border-gray-800 pb-4">
        <h2 class="text-xl font-semibold text-white">알림 설정</h2>
        <p class="text-sm text-gray-400">이메일 및 푸시 알림 수신 여부를 관리합니다.</p>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
          <div class="flex items-center gap-3">
            <span class="text-xl">📧</span>
            <div>
              <p class="font-medium text-gray-200">이메일 알림</p>
              <p class="text-xs text-gray-400">주요 업데이트 및 보안 관련 메일을 받습니다.</p>
            </div>
          </div>
          <!-- Custom Toggle Switch -->
          <button 
            @click="notifications.email = !notifications.email"
            class="w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative"
            :class="notifications.email ? 'bg-blue-600' : 'bg-gray-700'"
          >
            <div 
              class="w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200"
              :class="notifications.email ? 'translate-x-6' : 'translate-x-0'"
            ></div>
          </button>
        </div>

        <div class="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
          <div class="flex items-center gap-3">
            <span class="text-xl">🔔</span>
            <div>
              <p class="font-medium text-gray-200">푸시 알림</p>
              <p class="text-xs text-gray-400">브라우저 알림을 통해 실시간 소식을 받습니다.</p>
            </div>
          </div>
          <button 
            @click="notifications.push = !notifications.push"
            class="w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out relative"
            :class="notifications.push ? 'bg-blue-600' : 'bg-gray-700'"
          >
            <div 
              class="w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200"
              :class="notifications.push ? 'translate-x-6' : 'translate-x-0'"
            ></div>
          </button>
        </div>
      </div>
    </section>

    <!-- 3. Danger Zone -->
    <section class="glass-effect rounded-2xl border border-red-900/30 p-6 space-y-6">
      <div class="border-b border-red-900/30 pb-4">
        <h2 class="text-xl font-semibold text-red-500">Danger Zone</h2>
        <p class="text-sm text-gray-400">계정 로그아웃 및 삭제 관련 메뉴입니다.</p>
      </div>
      
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium text-gray-200">로그아웃</p>
          <p class="text-xs text-gray-400">현재 기기에서 계정 연결을 해제합니다.</p>
        </div>
        <button 
          @click="handleLogout"
          class="px-4 py-2 border border-red-600 text-red-500 hover:bg-red-600/10 rounded-lg transition-colors font-medium text-sm"
        >
          로그아웃
        </button>
      </div>
    </section>

  </div>
</template>
