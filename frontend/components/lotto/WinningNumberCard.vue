<script setup lang="ts">
import { computed } from 'vue'
import LottoBall from './LottoBall.vue'

interface Props {
  round: number;
  drawDate: string;
  numbers: number[];
  bonusNumber: number;
  firstPrizeAmount: number;
  firstPrizeWinnerCount: number;
  totalSalesAmount: number;
  isLoading?: boolean;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'prev': [],
  'next': []
}>()

const formattedDrawDate = computed(() => {
  if (!props.drawDate) return ''
  const date = new Date(props.drawDate)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${props.drawDate} (${days[date.getDay()]})`
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}
</script>

<template>
  <div class="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-xl backdrop-blur-sm">
    <div v-if="isLoading" class="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-700 pb-4">
        <div>
          <h3 class="text-2xl font-bold text-white">제 {{ round }}회 당첨결과</h3>
          <p class="text-sm text-slate-400">추첨일: {{ formattedDrawDate }}</p>
        </div>
        <div class="flex gap-2">
          <button 
            @click="emit('prev')"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-white transition-colors hover:bg-slate-700"
          >
            <span class="sr-only">이전 회차</span>
            &lt;
          </button>
          <button 
            @click="emit('next')"
            class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-white transition-colors hover:bg-slate-700"
          >
            <span class="sr-only">다음 회차</span>
            &gt;
          </button>
        </div>
      </div>

      <!-- Winning Numbers -->
      <div class="flex flex-col items-center justify-center gap-6 py-4 md:flex-row">
        <div class="flex gap-2 md:gap-4">
          <LottoBall v-for="num in numbers" :key="num" :number="num" size="lg" />
        </div>
        <div class="hidden text-3xl font-bold text-slate-600 md:block">+</div>
        <div class="flex items-center gap-4">
          <div class="text-xs font-medium text-slate-500 md:hidden">보너스</div>
          <LottoBall :number="bonusNumber" size="lg" is-bonus />
          <div class="hidden text-sm font-medium text-slate-500 md:block">보너스</div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="grid grid-cols-1 gap-4 border-t border-slate-700 pt-6 sm:grid-cols-2">
        <div class="flex flex-col gap-1 rounded-lg bg-slate-900/30 p-4">
          <span class="text-xs text-slate-500">1등 당첨금 (1인당)</span>
          <span class="text-lg font-bold text-amber-400">{{ formatCurrency(firstPrizeAmount) }}</span>
          <span class="text-xs text-slate-400">{{ firstPrizeWinnerCount }}명 당첨</span>
        </div>
        <div class="flex flex-col gap-1 rounded-lg bg-slate-900/30 p-4">
          <span class="text-xs text-slate-500">총 판매금액</span>
          <span class="text-lg font-bold text-slate-200">{{ formatCurrency(totalSalesAmount) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
