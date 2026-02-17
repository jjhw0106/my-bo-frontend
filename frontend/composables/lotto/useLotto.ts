import { ref } from 'vue'

// 타입 정의
export interface WinningNumbers {
  round: number;
  drawDate: string;
  numbers: number[];
  bonusNumber: number;
  firstPrizeAmount: number;
  firstPrizeWinnerCount: number;
  totalSalesAmount: number;
}

export interface PurchaseSummary {
  totalGames: number;
  totalWins: number;
  totalInvestment: number;
  totalPrize: number;
  winRate: number;
  rankDistribution: {
    FIRST: number;
    SECOND: number;
    THIRD: number;
    FOURTH: number;
    FIFTH: number;
    NONE: number;
  };
}

export interface PurchaseHistoryItem {
  gameId: number;
  round: number;
  drawDate: string;
  numbers: number[];
  winningNumbers: number[];
  bonusNumber: number;
  matchedNumbers: number[];
  matchedBonusNumber: boolean;
  rank: 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH' | 'FIFTH' | 'NONE' | null;
  prizeAmount: number;
  createdAt: string;
}

export interface PaginatedPurchaseHistory {
  content: PurchaseHistoryItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface HistoryParams {
  page?: number;
  size?: number;
  result?: 'ALL' | 'WON' | 'LOST';
  roundFrom?: number;
  roundTo?: number;
}

export interface GameInput {
  numbers: (number | null)[];
}

// 모듈 레벨 공유 상태
const isLoading = ref(false)
const error = ref<string | null>(null)
const currentWinningNumbers = ref<WinningNumbers | null>(null)
const purchaseSummary = ref<PurchaseSummary | null>(null)
const purchaseHistory = ref<PaginatedPurchaseHistory | null>(null)

// 각 작업별 독립적인 로딩 상태
const loadingStates = ref({
  winningNumbers: false,
  purchase: false,
  history: false,
  summary: false,
  delete: false
})

export const useLotto = () => {
  const config = useRuntimeConfig()

  // 당첨 번호 조회
  const fetchWinningNumbers = async (round?: number) => {
    loadingStates.value.winningNumbers = true
    isLoading.value = true
    error.value = null
    try {
      const query = round ? `?round=${round}` : ''
      const data = await $fetch<WinningNumbers>(`${config.public.apiBase}/lotto/winning-numbers${query}`)
      currentWinningNumbers.value = data
      return data
    } catch (err: any) {
      error.value = err.data?.message || '당첨 번호를 불러오는 데 실패했습니다.'
      throw err
    } finally {
      loadingStates.value.winningNumbers = false
      isLoading.value = Object.values(loadingStates.value).some(v => v)
    }
  }

  // 구매 등록
  const registerPurchase = async (round: number, games: GameInput[]) => {
    loadingStates.value.purchase = true
    isLoading.value = true
    error.value = null
    try {
      const formattedGames = games.map(g => ({
        numbers: [...g.numbers].filter((n): n is number => n !== null).sort((a, b) => a - b)
      }))

      const response = await $fetch(`${config.public.apiBase}/lotto/purchases`, {
        method: 'POST',
        body: {
          round,
          games: formattedGames
        },
        credentials: 'include'
      })

      // 등록 성공 후 요약 갱신
      await fetchSummary()
      return response
    } catch (err: any) {
      error.value = err.data?.message || '구매 등록에 실패했습니다.'
      throw err
    } finally {
      loadingStates.value.purchase = false
      isLoading.value = Object.values(loadingStates.value).some(v => v)
    }
  }

  // 구매 이력 조회
  const fetchPurchaseHistory = async (params: HistoryParams = {}) => {
    loadingStates.value.history = true
    isLoading.value = true
    error.value = null
    try {
      const queryParams = new URLSearchParams()
      if (params.page !== undefined) queryParams.append('page', params.page.toString())
      if (params.size !== undefined) queryParams.append('size', params.size.toString())
      if (params.result) queryParams.append('result', params.result)
      if (params.roundFrom) queryParams.append('roundFrom', params.roundFrom.toString())
      if (params.roundTo) queryParams.append('roundTo', params.roundTo.toString())

      const data = await $fetch<PaginatedPurchaseHistory>(`${config.public.apiBase}/lotto/purchases?${queryParams.toString()}`, {
        credentials: 'include'
      })
      purchaseHistory.value = data
      return data
    } catch (err: any) {
      error.value = err.data?.message || '구매 이력을 불러오는 데 실패했습니다.'
      throw err
    } finally {
      loadingStates.value.history = false
      isLoading.value = Object.values(loadingStates.value).some(v => v)
    }
  }

  // 통계 요약 조회
  const fetchSummary = async () => {
    loadingStates.value.summary = true
    isLoading.value = true
    error.value = null
    try {
      const data = await $fetch<PurchaseSummary>(`${config.public.apiBase}/lotto/purchases/summary`, {
        credentials: 'include'
      })
      purchaseSummary.value = data
      return data
    } catch (err: any) {
      error.value = err.data?.message || '통계 정보를 불러오는 데 실패했습니다.'
      throw err
    } finally {
      loadingStates.value.summary = false
      isLoading.value = Object.values(loadingStates.value).some(v => v)
    }
  }

  // 구매 내역 삭제
  const deletePurchase = async (gameId: number) => {
    loadingStates.value.delete = true
    isLoading.value = true
    try {
      await $fetch(`${config.public.apiBase}/lotto/purchases/${gameId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      await fetchSummary()
    } catch (err: any) {
      error.value = err.data?.message || '삭제에 실패했습니다.'
      throw err
    } finally {
      loadingStates.value.delete = false
      isLoading.value = Object.values(loadingStates.value).some(v => v)
    }
  }

  // 랜덤 번호 생성
  const generateRandomNumbers = (): number[] => {
    const numbers = new Set<number>()
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1)
    }
    return Array.from(numbers).sort((a, b) => a - b)
  }

  // 현재 판매 회차 계산 (매주 토요일 20:45 기준)
  const calculateCurrentRound = (): number => {
    const firstDrawingDate = new Date('2002-12-07T20:45:00')
    const now = new Date()
    const diffMs = now.getTime() - firstDrawingDate.getTime()
    const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000))
    return diffWeeks + 1
  }

  return {
    isLoading,
    error,
    currentWinningNumbers,
    purchaseSummary,
    purchaseHistory,
    fetchWinningNumbers,
    registerPurchase,
    fetchPurchaseHistory,
    fetchSummary,
    deletePurchase,
    generateRandomNumbers,
    calculateCurrentRound
  }
}
