<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLotto } from '~/composables/lotto/useLotto'
import { useExcel } from '~/composables/useExcel'
import HistoryFilter from '~/components/lotto/HistoryFilter.vue'
import PurchaseHistoryTable from '~/components/lotto/PurchaseHistoryTable.vue'

definePageMeta({
  layout: 'dashboard'
})

const { 
  isLoading, 
  purchaseHistory,
  fetchPurchaseHistory
} = useLotto()

const { downloadAsExcel } = useExcel()

const filter = ref({
  result: 'ALL' as 'ALL' | 'WON' | 'LOST',
  roundFrom: undefined as number | undefined,
  roundTo: undefined as number | undefined
})

const currentPage = ref(0)

const loadHistory = async (page = 0) => {
  currentPage.value = page
  await fetchPurchaseHistory({
    page,
    size: 20,
    ...filter.value
  })
}

const handleSearch = () => {
  loadHistory(0)
}

const handleExcelDownload = () => {
  if (!purchaseHistory.value?.content.length) return
  
  const data = purchaseHistory.value.content.map(item => ({
    '회차': `${item.round}회`,
    '추첨일': item.drawDate || '-',
    '내 번호': item.numbers.join(', '),
    '당첨 번호': item.winningNumbers?.join(', ') || '-',
    '보너스': item.bonusNumber || '-',
    '결과': item.rank === 'NONE' ? '미당첨' : item.rank || '추첨 대기',
    '당첨금': new Intl.NumberFormat('ko-KR').format(item.prizeAmount) + '원',
    '등록일': item.createdAt.split('T')[0]
  }))
  
  downloadAsExcel(data, `로또_구매이력_${new Date().toISOString().split('T')[0]}`)
}

onMounted(() => {
  loadHistory()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">구매/당첨 이력</h1>
        <p class="mt-2 text-slate-400">전체 로또 구매 이력과 당첨 결과를 확인하세요.</p>
      </div>
      <button 
        @click="handleExcelDownload"
        class="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
      >
        <span>엑셀 다운로드</span>
      </button>
    </div>

    <!-- Filter -->
    <HistoryFilter v-model="filter" @search="handleSearch" />

    <!-- Table -->
    <section>
      <PurchaseHistoryTable
        :items="purchaseHistory?.content || []"
        :is-loading="isLoading"
      />
    </section>

    <!-- Pagination -->
    <div v-if="purchaseHistory && purchaseHistory.totalPages > 1" class="flex items-center justify-center gap-2">
      <button 
        @click="loadHistory(currentPage - 1)"
        :disabled="currentPage === 0"
        class="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
      >
        이전
      </button>
      <div class="flex gap-1">
        <button 
          v-for="p in purchaseHistory.totalPages" 
          :key="p"
          @click="loadHistory(p - 1)"
          class="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all"
          :class="[
            currentPage === p - 1 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          ]"
        >
          {{ p }}
        </button>
      </div>
      <button 
        @click="loadHistory(currentPage + 1)"
        :disabled="currentPage === purchaseHistory.totalPages - 1"
        class="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
      >
        다음
      </button>
    </div>
  </div>
</template>
