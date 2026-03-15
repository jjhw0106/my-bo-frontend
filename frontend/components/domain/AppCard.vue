<script setup lang="ts">
interface AppItem {
  id: number
  name: string
  description: string
  emoji: string
  url: string
  tags: string
}

defineProps<{
  app: AppItem
  isAdmin?: boolean
}>()

defineEmits<{
  (e: 'delete', id: number): void
}>()

const splitTags = (tags: string): string[] => {
  if (!tags) return []
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}
</script>

<template>
  <div class="group relative flex flex-col justify-between rounded-xl border border-slate-700/60 bg-slate-800/50 p-6 w-96 h-64 transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5">
    <!-- Delete Button (ADMIN only) -->
    <button
      v-if="isAdmin"
      @click="$emit('delete', app.id)"
      class="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-red-500/20 hover:text-red-400"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>

    <!-- Top: Emoji + Title -->
    <div>
      <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-700/60 text-2xl group-hover:bg-blue-500/20 transition-colors">
        {{ app.emoji }}
      </div>
      <h3 class="text-lg font-semibold text-white">{{ app.name }}</h3>
      <p class="mt-1 text-sm text-slate-400 leading-relaxed">{{ app.description }}</p>

      <!-- Tags -->
      <div class="mt-3 flex flex-wrap gap-1.5">
        <span
          v-for="tag in splitTags(app.tags)"
          :key="tag"
          class="rounded-md bg-slate-700/50 px-2 py-0.5 text-xs text-slate-400"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Bottom: Download Button -->
    <a
      :href="app.url"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20 active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download
    </a>
  </div>
</template>
