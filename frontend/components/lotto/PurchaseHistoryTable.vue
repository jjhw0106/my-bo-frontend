<script setup lang="ts">
import { computed } from 'vue'
import RankBadge from './RankBadge.vue'

export interface PurchaseItem {
  gameId: number;
  round: number;
  drawDate?: string;
  numbers: number[];
  winningNumbers?: number[];
  bonusNumber?: number;
  rank: 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH' | 'FIFTH' | 'NONE' | null;
  prizeAmount: number;
  createdAt: string;
}

interface Props {
  items: PurchaseItem[];
  isLoading?: boolean;
  isDashboard?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isDashboard: false
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return dateStr.split('T')[0]
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원'
}

const tableHeaders = computed(() => {
  if (props.isDashboard) {
    return ['회차', '번호', '결과', '등록일']
  }
  return ['회차', '추첨일', '번호', '결과', '당첨금', '등록일']
})
</script>

<template>
  <div class="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 shadow-lg backdrop-blur-sm">
    <div v-if="isLoading" class="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-700/50 text-xs font-semibold uppercase text-slate-400">
          <tr>
            <th v-for="header in tableHeaders" :key="header" class="px-6 py-4">{{ header }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700">
          <tr v-for="item in items" :key="item.gameId" class="transition-colors hover:bg-slate-700/30">
            <td class="whitespace-nowrap px-6 py-4 font-medium text-white">{{ item.round }}회</td>
            
            <td v-if="!isDashboard" class="whitespace-nowrap px-6 py-4 text-slate-300">
              {{ item.drawDate || '-' }}
            </td>
            
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="num in item.numbers" 
                  :key="num"
                  class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                  :class="[
                    item.winningNumbers?.includes(num) || item.bonusNumber === num
                      ? 'bg-blue-500 text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
                      : 'bg-slate-700 text-slate-400'
                  ]"
                >
                  {{ num }}
                </span>
              </div>
            </td>
            
            <td class="whitespace-nowrap px-6 py-4">
              <RankBadge :rank="item.rank" size="sm" />
            </td>
            
            <td v-if="!isDashboard" class="whitespace-nowrap px-6 py-4 font-semibold text-slate-200">
              {{ formatCurrency(item.prizeAmount) }}
            </td>
            
            <td class="whitespace-nowrap px-6 py-4 text-slate-400">
              {{ formatDate(item.createdAt) }}
            </td>
          </tr>
          
          <tr v-if="items.length === 0 && !isLoading">
            <td :colspan="tableHeaders.length" class="px-6 py-12 text-center text-slate-500">
              기록이 없습니다.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
