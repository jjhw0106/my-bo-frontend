<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon?: string
  iconBg?: string
}>()
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div
        v-if="icon"
        class="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg"
        :class="iconBg || 'bg-indigo-600 shadow-indigo-900/20'"
      >
        {{ icon }}
      </div>
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">{{ title }}</h1>
        <p v-if="description" class="text-gray-400 mt-1">{{ description }}</p>
      </div>
    </div>
    <div v-if="$slots.actions" class="shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>
