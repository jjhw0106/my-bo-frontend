<script setup lang="ts">
import { ref } from 'vue'

interface FilterCriteria {
  result: 'ALL' | 'WON' | 'LOST';
  roundFrom?: number;
  roundTo?: number;
}

const props = defineProps<{
  modelValue: FilterCriteria
}>()

const emit = defineEmits<{
  'update:modelValue': [criteria: FilterCriteria],
  'search': []
}>()

const criteria = ref<FilterCriteria>({ ...props.modelValue })

const updateFilter = (key: keyof FilterCriteria, value: any) => {
  criteria.value[key] = value
  emit('update:modelValue', { ...criteria.value })
}

const handleSearch = () => {
  emit('search')
}
</script>

<template>
  <div class="flex flex-col gap-4 rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-lg backdrop-blur-sm sm:flex-row sm:items-end sm:justify-between">
    <div class="flex flex-wrap gap-6">
      <!-- Result Filter -->
      <div class="flex flex-col gap-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">결과 필터</label>
        <div class="flex rounded-lg bg-slate-900 p-1">
          <button 
            v-for="opt in ['ALL', 'WON', 'LOST']" 
            :key="opt"
            @click="updateFilter('result', opt)"
            class="rounded-md px-4 py-1.5 text-sm font-medium transition-all"
            :class="[
              criteria.result === opt 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-300'
            ]"
          >
            {{ opt === 'ALL' ? '전체' : opt === 'WON' ? '당첨만' : '미당첨' }}
          </button>
        </div>
      </div>

      <!-- Round Range -->
      <div class="flex flex-col gap-2">
        <label class="text-xs font-semibold uppercase tracking-wider text-slate-500">회차 범위</label>
        <div class="flex items-center gap-2">
          <input 
            type="number" 
            v-model="criteria.roundFrom"
            @input="updateFilter('roundFrom', ($event.target as HTMLInputElement).value)"
            placeholder="시작"
            class="w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span class="text-slate-500">~</span>
          <input 
            type="number" 
            v-model="criteria.roundTo"
            @input="updateFilter('roundTo', ($event.target as HTMLInputElement).value)"
            placeholder="종료"
            class="w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Action -->
    <button 
      @click="handleSearch"
      class="rounded-lg bg-blue-600 px-8 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-500"
    >
      검색하기
    </button>
  </div>
</template>
