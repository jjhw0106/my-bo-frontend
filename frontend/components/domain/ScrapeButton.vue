<script setup lang="ts">
interface PlatformInfo {
  name: string;
  icon: string;
  color: string;
}

const props = defineProps<{
  platformId: string;
  platformInfo: PlatformInfo;
  isScraping: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <button 
    @click="emit('click')"
    :disabled="isScraping"
    class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
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
    
    <span v-if="isScraping" class="animate-spin">↻</span>
    <span v-else class="group-hover:rotate-12 transition-transform">🤖</span>
    
    <span>{{ isScraping ? `${platformInfo.name} 데이터 수집 중...` : `${platformInfo.name}에서 정보 가져오기` }}</span>
  </button>
</template>
