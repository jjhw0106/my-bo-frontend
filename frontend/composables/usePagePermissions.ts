export const usePagePermissions = () => {
    // 보호된 라우트 목록을 관리하는 State
    // 나중에 Admin 페이지에서 이 값을 API로 받아오거나 수정할 수 있습니다.
    const protectedRoutes = useState<string[]>('protectedRoutes', () => [
        '/stocks',
        '/dashboard',
        '/mypage',
        '/admin',
        '/my-career'
    ]);

    // 주어진 경로가 보호된 경로인지 확인
    const isProtected = (path: string): boolean => {
        // 정확히 일치하거나 하위 경로인 경우 (예: /stocks/1) 체크
        return protectedRoutes.value.some(route => 
            path === route || path.startsWith(`${route}/`)
        );
    };

    // (Future Use) 보호된 라우트 목록 업데이트
    const setProtectedRoutes = (routes: string[]) => {
        protectedRoutes.value = routes;
    };

    return {
        protectedRoutes,
        isProtected,
        setProtectedRoutes
    };
};
