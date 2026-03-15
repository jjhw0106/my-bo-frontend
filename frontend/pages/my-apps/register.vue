<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const config = useRuntimeConfig()
const router = useRouter()
const { user } = useAuth()

const form = reactive({
  emoji: '🎰',
  name: '',
  description: '',
  url: '',
  tags: '',
})

const emojiOptions = ['🎰', '📊', '🛡️', '⚡', '📦', '🎯', '🔧', '💡', '🚀', '🎨', '📱', '🌐', '💰', '📝', '🎲']
const submitting = ref(false)

const handleSubmit = async () => {
  if (user.value?.role !== 'ADMIN') {
    alert('관리자 권한만 앱 등록이 가능합니다.')
    return
  }
  submitting.value = true
  try {
    await $fetch(`${config.public.apiBase}/my-app-items`, {
      method: 'POST',
      body: {
        emoji: form.emoji,
        name: form.name,
        description: form.description,
        url: form.url,
        tags: form.tags,
      },
    })
    await router.push('/my-apps')
  } catch (e) {
    console.error('Failed to register app:', e)
    alert('앱 등록에 실패했습니다.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader title="App 등록" description="새로운 앱을 등록합니다" />

    <div class="max-w-2xl rounded-xl border border-slate-700/60 bg-slate-800/50 p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Emoji -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">아이콘</label>
          <select
            v-model="form.emoji"
            class="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-white text-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          >
            <option v-for="emoji in emojiOptions" :key="emoji" :value="emoji">
              {{ emoji }}
            </option>
          </select>
        </div>

        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">앱 이름</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="예: My Lotto"
            class="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">설명</label>
          <textarea
            v-model="form.description"
            rows="3"
            required
            placeholder="앱에 대한 간단한 설명을 입력하세요"
            class="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
          ></textarea>
        </div>

        <!-- URL -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">URL</label>
          <input
            v-model="form.url"
            type="text"
            required
            placeholder="https://example.com"
            class="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">태그</label>
          <input
            v-model="form.tags"
            type="text"
            placeholder="Nuxt, PWA, Tailwind (쉼표로 구분)"
            class="w-full rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <!-- Submit -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="submitting"
            class="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? '등록 중...' : '앱 등록' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
