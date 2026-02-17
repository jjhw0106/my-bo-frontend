<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLotto } from '~/composables/lotto/useLotto'
import LottoNumberInput from './LottoNumberInput.vue'

const { generateRandomNumbers, registerPurchase, isLoading, calculateCurrentRound, error } = useLotto()

const currentRound = calculateCurrentRound()
const selectedRound = ref(currentRound)

// 최근 10회차 목록
const roundOptions = computed(() => {
  const rounds = []
  for (let i = 0; i < 10; i++) {
    rounds.push(currentRound - i)
  }
  return rounds
})

interface Game {
  id: number;
  numbers: (number | null)[];
}

const games = ref<Game[]>([
  { id: Date.now(), numbers: [null, null, null, null, null, null] }
])

const addGame = () => {
  if (games.value.length < 5) {
    games.value.push({ id: Date.now(), numbers: [null, null, null, null, null, null] })
  }
}

const removeGame = (index: number) => {
  if (games.value.length > 1) {
    games.value.splice(index, 1)
  }
}

const autoFill = (index: number) => {
  games.value[index].numbers = generateRandomNumbers()
}

const isValid = computed(() => {
  return games.value.every(game => 
    game.numbers.every(n => n !== null && n >= 1 && n <= 45) &&
    new Set(game.numbers).size === 6
  )
})

const emit = defineEmits<{
  'success': []
}>()

const successMessage = ref<string | null>(null)

const handleSubmit = async () => {
  if (!isValid.value) return

  try {
    await registerPurchase(selectedRound.value, games.value.map(g => ({ numbers: g.numbers })))
    games.value = [{ id: Date.now(), numbers: [null, null, null, null, null, null] }]
    successMessage.value = '성공적으로 등록되었습니다.'
    setTimeout(() => successMessage.value = null, 3000)
    emit('success')
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="flex flex-col gap-6 rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-xl backdrop-blur-sm">
    <!-- Round Selection -->
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
      <label class="text-sm font-medium text-slate-400">회차 선택</label>
      <div class="flex gap-2">
        <select 
          v-model="selectedRound"
          class="rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="round in roundOptions" :key="round" :value="round">
            제 {{ round }}회
          </option>
        </select>
        <button 
          @click="selectedRound = currentRound"
          class="text-xs text-blue-400 hover:underline"
        >
          최신 회차 자동선택
        </button>
      </div>
    </div>

    <!-- Games -->
    <div class="flex flex-col gap-4">
      <div 
        v-for="(game, index) in games" 
        :key="game.id"
        class="group relative flex flex-col gap-4 rounded-lg border border-slate-700 bg-slate-900/50 p-4 transition-all hover:border-slate-600"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">게임 {{ index + 1 }}</span>
          <div class="flex gap-2">
            <button 
              @click="autoFill(index)"
              class="text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              자동 생성
            </button>
            <button 
              v-if="games.length > 1"
              @click="removeGame(index)"
              class="text-xs font-medium text-red-400 hover:text-red-300"
            >
              삭제
            </button>
          </div>
        </div>
        
        <LottoNumberInput v-model="game.numbers" :disabled="isLoading" />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-col gap-4 border-t border-slate-700 pt-6">
      <button
        v-if="games.length < 5"
        @click="addGame"
        class="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-600 py-3 text-sm font-medium text-slate-400 transition-colors hover:border-slate-500 hover:bg-slate-700/30 hover:text-slate-200"
      >
        <span>+ 게임 추가</span>
        <span class="text-xs">(최대 5게임)</span>
      </button>

      <!-- Success Message -->
      <transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="successMessage"
          class="flex items-center gap-2 rounded-lg bg-green-900/20 border border-green-500/50 px-4 py-3 text-sm text-green-400"
        >
          <span class="text-green-500">✓</span>
          <span>{{ successMessage }}</span>
        </div>
      </transition>

      <!-- Error Message -->
      <transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div
          v-if="error"
          class="flex items-center gap-2 rounded-lg bg-red-900/20 border border-red-500/50 px-4 py-3 text-sm text-red-400"
        >
          <span class="text-red-500">⚠</span>
          <span>{{ error }}</span>
        </div>
      </transition>

      <button
        @click="handleSubmit"
        :disabled="!isValid || isLoading"
        class="flex items-center justify-center rounded-lg bg-blue-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none"
      >
        <div v-if="isLoading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        {{ isLoading ? '등록 중...' : '등록하기' }}
      </button>
    </div>
  </div>
</template>
