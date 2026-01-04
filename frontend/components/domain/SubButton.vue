<template>
  <button 
    @click="$emit('click')"
    :disabled="disabled"
    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
  >
    <!-- 기본 아이콘: 엑셀 다운로드 (슬롯으로 교체 가능) -->
    <slot name="icon">
      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </slot>
    {{ label }}
  </button>
</template>

<script setup lang="ts">
/**
 * SubButton 컴포넌트
 * @description 도메인 기능에서 보조적으로 사용되는 액션 버튼 (예: 엑셀 다운로드 등)
 */
defineProps<{
  label: string;
  disabled?: boolean;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>
