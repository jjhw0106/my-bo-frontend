<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  totalGames: number;
  totalWins: number;
  totalInvestment: number;
  totalPrize: number;
}

const props = defineProps<Props>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}

const summaryItems = computed(() => [
  { label: '총 구매 게임', value: `${props.totalGames}게임`, color: 'text-blue-400' },
  { label: '당첨 횟수', value: `${props.totalWins}회`, color: 'text-amber-400' },
  { label: '총 투자 금액', value: formatCurrency(props.totalInvestment), color: 'text-slate-200' },
  { label: '총 당첨 금액', value: formatCurrency(props.totalPrize), color: 'text-green-400' }
])
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div 
      v-for="item in summaryItems" 
      :key="item.label"
      class="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-lg backdrop-blur-sm"
    >
      <p class="text-sm font-medium text-slate-500">{{ item.label }}</p>
      <p class="mt-2 text-2xl font-bold" :class="item.color">{{ item.value }}</p>
    </div>
  </div>
</template>
