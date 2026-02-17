<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  modelValue: (number | null)[];
  disabled?: boolean;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [numbers: (number | null)[]]
}>()

const inputs = ref<(number | null)[]>([...props.modelValue])
const inputRefs = ref<HTMLInputElement[]>([])
const errorMessage = ref<string | null>(null)

watch(() => props.modelValue, (newVal) => {
  inputs.value = [...newVal]
}, { deep: true })

// 중복 번호 검사
const hasDuplicates = computed(() => {
  const validNumbers = inputs.value.filter((n): n is number => n !== null && n >= 1 && n <= 45)
  return validNumbers.length !== new Set(validNumbers).size
})

// 모든 번호가 입력되었는지 확인
const allFilled = computed(() => {
  return inputs.value.every(n => n !== null && n >= 1 && n <= 45)
})

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value

  if (value.length > 2) {
    target.value = value.slice(0, 2)
  }

  const num = target.value ? parseInt(target.value) : null

  // 범위 검증
  if (num !== null && (num < 1 || num > 45)) {
    errorMessage.value = '1~45 사이의 숫자를 입력하세요'
    setTimeout(() => errorMessage.value = null, 2000)
  } else {
    errorMessage.value = null
  }

  inputs.value[index] = num

  // 중복 검증
  if (hasDuplicates.value) {
    errorMessage.value = '중복된 번호가 있습니다'
    setTimeout(() => errorMessage.value = null, 2000)
  }

  // 모든 번호가 입력되면 자동 정렬
  if (allFilled.value && !hasDuplicates.value) {
    const sorted = [...inputs.value].sort((a, b) => (a as number) - (b as number))
    inputs.value = sorted
    emit('update:modelValue', sorted)
    return
  }

  emit('update:modelValue', [...inputs.value])

  // 자동 포커스 이동
  if (target.value.length >= 2 && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && !inputs.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

const getBallColor = (num: number | null, index: number) => {
  if (num === null) return 'border-slate-600 bg-slate-800 text-slate-400'
  if (num < 1 || num > 45) return 'border-red-500 bg-red-900/20 text-red-400 ring-2 ring-red-500/50'

  // 중복된 번호 강조
  const isDuplicate = inputs.value.filter((n, i) => n === num && i !== index).length > 0
  if (isDuplicate) {
    return 'border-orange-500 bg-orange-900/30 text-orange-400 ring-2 ring-orange-500/50 animate-pulse'
  }

  if (num <= 10) return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500'
  if (num <= 20) return 'border-blue-500/50 bg-blue-500/10 text-blue-500'
  if (num <= 30) return 'border-red-500/50 bg-red-500/10 text-red-500'
  if (num <= 40) return 'border-gray-500/50 bg-gray-500/10 text-gray-400'
  return 'border-green-500/50 bg-green-500/10 text-green-500'
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-2 sm:gap-3">
      <div
        v-for="(num, idx) in inputs"
        :key="idx"
        class="relative"
      >
        <input
          ref="inputRefs"
          type="number"
          min="1"
          max="45"
          :value="num === null ? '' : num"
          :disabled="disabled"
          @input="handleInput(idx, $event)"
          @keydown="handleKeyDown(idx, $event)"
          class="h-10 w-10 rounded-full border-2 text-center text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:h-12 sm:w-12 sm:text-base"
          :class="getBallColor(num, idx)"
          placeholder="-"
        />
      </div>
    </div>

    <!-- 에러 메시지 -->
    <transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="errorMessage"
        class="flex items-center gap-2 rounded-lg bg-red-900/20 border border-red-500/50 px-3 py-2 text-sm text-red-400"
      >
        <span class="text-red-500">⚠</span>
        <span>{{ errorMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
