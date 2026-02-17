<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  rank: 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH' | 'FIFTH' | 'NONE' | null;
  size?: 'sm' | 'md';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const rankInfo = computed(() => {
  switch (props.rank) {
    case 'FIRST':
      return { label: '1등', classes: 'text-amber-300 bg-amber-900/30 border-amber-700' }
    case 'SECOND':
      return { label: '2등', classes: 'text-purple-400 bg-purple-900/30 border-purple-700' }
    case 'THIRD':
      return { label: '3등', classes: 'text-blue-400 bg-blue-900/30 border-blue-700' }
    case 'FOURTH':
      return { label: '4등', classes: 'text-green-400 bg-green-900/30 border-green-700' }
    case 'FIFTH':
      return { label: '5등', classes: 'text-teal-400 bg-teal-900/30 border-teal-700' }
    case 'NONE':
      return { label: '미당첨', classes: 'text-gray-500 bg-gray-800/30 border-gray-700' }
    default:
      return { label: '추첨 대기', classes: 'text-yellow-400 bg-yellow-900/30 border-yellow-700' }
  }
})

const sizeClass = computed(() => {
  return props.size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
})
</script>

<template>
  <span
    class="inline-flex items-center justify-center border rounded-full font-semibold glass-effect"
    :class="[rankInfo.classes, sizeClass]"
  >
    {{ rankInfo.label }}
  </span>
</template>

<style scoped>
.glass-effect {
  backdrop-filter: blur(4px);
}
</style>
