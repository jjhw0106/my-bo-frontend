<script setup lang="ts">
import { onMounted } from 'vue'
import { useLotto } from '~/composables/lotto/useLotto'
import WinningNumberCard from '~/components/lotto/WinningNumberCard.vue'
import PurchaseSummaryCards from '~/components/lotto/PurchaseSummaryCards.vue'
import PurchaseHistoryTable from '~/components/lotto/PurchaseHistoryTable.vue'

definePageMeta({
  layout: 'dashboard'
})

const { 
  isLoading, 
  currentWinningNumbers, 
  purchaseSummary, 
  purchaseHistory,
  fetchWinningNumbers,
  fetchSummary,
  fetchPurchaseHistory
} = useLotto()

const loadDashboardData = async () => {
  await Promise.all([
    fetchWinningNumbers(),
    fetchSummary(),
    fetchPurchaseHistory({ page: 0, size: 5 })
  ])
}

const handlePrevRound = async () => {
  if (currentWinningNumbers.value) {
    await fetchWinningNumbers(currentWinningNumbers.value.round - 1)
  }
}

const handleNextRound = async () => {
  if (currentWinningNumbers.value) {
    await fetchWinningNumbers(currentWinningNumbers.value.round + 1)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white">Lotto Dashboard</h1>
      <p class="mt-2 text-slate-400">로또 당첨 번호 확인 및 나의 구매 현황을 관리하세요.</p>
    </div>

    <!-- Winning Number Card -->
    <section>
      <WinningNumberCard
        v-if="currentWinningNumbers"
        v-bind="currentWinningNumbers"
        :is-loading="isLoading"
        @prev="handlePrevRound"
        @next="handleNextRound"
      />
      <div v-else-if="isLoading" class="h-64 animate-pulse rounded-xl bg-slate-800/50"></div>
    </section>

    <!-- Summary Stats -->
    <section>
      <h2 class="mb-4 text-xl font-semibold text-white">나의 구매 요약</h2>
      <PurchaseSummaryCards
        v-if="purchaseSummary"
        v-bind="purchaseSummary"
      />
      <div v-else-if="isLoading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 4" :key="i" class="h-32 animate-pulse rounded-xl bg-slate-800/50"></div>
      </div>
    </section>

    <!-- Recent Purchases -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-white">최근 구매 내역</h2>
        <NuxtLink 
          to="/lotto/history" 
          class="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline"
        >
          전체 보기 &rarr;
        </NuxtLink>
      </div>
      <PurchaseHistoryTable
        :items="purchaseHistory?.content.slice(0, 5) || []"
        :is-loading="isLoading"
        is-dashboard
      />
    </section>
  </div>
</template>
