export const useScraper = () => {
  const isScraping = ref(false);
  const error = ref<string | null>(null);
  const scrapedResults = ref<Record<string, any>>({});

  /**
   * 특정 플랫폼의 스크래핑을 실행합니다.
   * @param platformId 플랫폼 식별자 (wanted, jobkorea 등)
   * @param platformName 플랫폼 표시 이름 (알림 메시지용)
   * @param credentials 계정 정보 (id, pw)
   */
  const scrapePlatform = async (
    platformId: string, 
    platformName: string, 
    credentials?: { id: string; pw: string }
  ) => {
    isScraping.value = true;
    error.value = null;

    try {
      const response: any = await $fetch(`http://localhost:4000/scraper/${platformId}`, {
        method: 'POST',
        body: credentials
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
    platforms: { id: string; name: string }[], 
    credentialsMap: Record<string, { id: string; pw: string }>
  ) => {
    isScraping.value = true;
    const results = [];
    
    // 병렬 실행
    const promises = platforms.map(p => 
      scrapePlatform(p.id, p.name, credentialsMap[p.id])
    );
    
    const finalResults = await Promise.all(promises);
    isScraping.value = false;
    return finalResults;
  };

  return {
    isScraping,
    error,
    scrapedResults,
    scrapePlatform,
    scrapeMultiple
  };
};