<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

interface AppItem {
  id: number
  name: string
  description: string
  emoji: string
  url: string
  tags: string
}

const config = useRuntimeConfig()
const { user } = useAuth()
const loading = ref(true)
const apps = ref<AppItem[]>([])

const isAdmin = computed(() => user.value?.role === 'ADMIN')

onMounted(async () => {
  try {
    apps.value = await $fetch<AppItem[]>(`${config.public.apiBase}/my-app-items`)
  } catch (e) {
    console.error('Failed to fetch apps:', e)
  } finally {
    loading.value = false
  }
})

const deleteApp = async (id: number) => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await $fetch(`${config.public.apiBase}/my-app-items/${id}`, { method: 'DELETE' })
    apps.value = apps.value.filter(app => app.id !== id)
  } catch (e) {
    console.error('Failed to delete app:', e)
    alert('삭제에 실패했습니다.')
  }
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="My Apps" description="내가 개발한 정적 페이지 모음" />

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-3">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        <span class="text-sm text-slate-400">앱 목록을 불러오는 중...</span>
      </div>
    </div>

    <!-- App Grid -->
    <div v-else class="flex flex-wrap gap-6">
      <DomainAppCard
        v-for="app in apps"
        :key="app.id"
        :app="app"
        :is-admin="isAdmin"
        @delete="deleteApp"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && apps.length === 0" class="text-center py-20">
      <p class="text-slate-400">등록된 앱이 없습니다.</p>
    </div>
  </div>
</template>
