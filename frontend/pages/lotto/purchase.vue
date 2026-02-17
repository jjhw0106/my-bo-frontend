<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLotto } from '~/composables/lotto/useLotto'
import PurchaseForm from '~/components/lotto/PurchaseForm.vue'
import PurchaseHistoryTable from '~/components/lotto/PurchaseHistoryTable.vue'

definePageMeta({
  layout: 'dashboard'
})

const { 
  isLoading, 
  purchaseHistory,
  fetchPurchaseHistory,
  calculateCurrentRound
} = useLotto()

const currentRound = calculateCurrentRound()

const loadCurrentRoundPurchases = async () => {
  await fetchPurchaseHistory({ 
    page: 0, 
    size: 20, 
    roundFrom: currentRound, 
    roundTo: currentRound 
  })
}

onMounted(() => {
  loadCurrentRoundPurchases()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white">구매 번호 등록</h1>
      <p class="mt-2 text-slate-400">구매한 로또 번호를 등록하고 당첨 여부를 자동으로 확인하세요.</p>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Registration Form -->
      <section>
        <h2 class="mb-4 text-xl font-semibold text-white">새 번호 등록</h2>
        <PurchaseForm @success="loadCurrentRoundPurchases" />
      </section>

      <!-- Current Round Purchases -->
      <section>
        <h2 class="mb-4 text-xl font-semibold text-white">이번 회차 구매 목록 ({{ currentRound }}회)</h2>
        <PurchaseHistoryTable
          :items="purchaseHistory?.content || []"
          :is-loading="isLoading"
          is-dashboard
        />
        <p class="mt-4 text-xs text-slate-500">
          * 한 회차에 최대 5게임까지 등록할 수 있습니다.
        </p>
      </section>
    </div>
  </div>
</template>
