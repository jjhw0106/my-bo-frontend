// 함수 외부로 이동하여 모든 useScraper 호출이 동일한 상태를 공유하도록 함
const isScraping = ref(false);
const error = ref<string | null>(null);
const scrapedResults = ref<Record<string, any>>({});
const historyData = ref<any[]>([]);

export const useScraper = () => {

  const fetchHistory = async (userId: string) => {
    isScraping.value = true;
    try {
      const response: any = await $fetch(`http://localhost:4000/scraper/history/${userId}`);
      historyData.value = response || [];
      return response;
    } catch (err) {
      console.error('Fetch error:', err);
      return [];
    } finally {
      isScraping.value = false;
    }
  };

  const scrapePlatform = async (
    appUserId: string,
    platformId: string,
    platformName: string,
    credentials?: { id: string; pw: string }
  ) => {
    isScraping.value = true;
    error.value = null;

    try {

      const body = {
        platformUserId: credentials?.id,
        platformUserPw: credentials?.pw,
        appUserId: appUserId,
      }

      const response: any = await $fetch(`http://localhost:4000/scraper/${platformId}`, {
        method: 'POST',
        body: body
      });

      if (response.success) {
        scrapedResults.value[platformId] = response.data;
        console.log(`[Scraper] Success (${platformId}):`, response.data);
        return { success: true, platformId, data: response.data };
      } else {
        throw new Error(response.error || '알 수 없는 오류');
      }

    } catch (err: any) {
      const errorMessage = err.message || '서버 연결 실패';
      error.value = errorMessage;
      console.error(`[Scraper] Failed (${platformId}):`, err);
      return { success: false, platformId, error: errorMessage };
    } finally {
      isScraping.value = false;
    }
  };

  /**
   * 여러 플랫폼을 순차적으로 또는 병렬로 스크래핑합니다.
   */
  const scrapeMultiple = async (
    appUserId: string,
    platforms: { id: string; name: string }[],
    credentialsMap: Record<string, { id: string; pw: string }>
  ) => {
    isScraping.value = true;
    const results = [];

    // 병렬 실행
    const promises = platforms.map(p =>
      scrapePlatform(appUserId, p.id, p.name, credentialsMap[p.id])
    );

    const finalResults = await Promise.all(promises);
    isScraping.value = false;
    return finalResults;
  };

  return {
    isScraping,
    error,
    scrapedResults,
    historyData,
    fetchHistory,
    scrapePlatform,
    scrapeMultiple
  };
};