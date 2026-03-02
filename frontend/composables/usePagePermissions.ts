const STORAGE_KEY = 'protectedRoutes';

const DEFAULT_PROTECTED_ROUTES = [
    '/stocks',
    '/dashboard',
    '/mypage',
    '/admin',
    '/my-career',
    '/settings'
];

export const usePagePermissions = () => {
    const protectedRoutes = useState<string[]>('protectedRoutes', () => [...DEFAULT_PROTECTED_ROUTES]);

    const isProtected = (path: string): boolean => {
        return protectedRoutes.value.some(route =>
            path === route || path.startsWith(`${route}/`)
        );
    };

    const setProtectedRoutes = (routes: string[]) => {
        protectedRoutes.value = routes;
        if (import.meta.client) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
        }
    };

    const toggleRoute = (route: string) => {
        const current = [...protectedRoutes.value];
        const index = current.indexOf(route);
        if (index >= 0) {
            current.splice(index, 1);
        } else {
            current.push(route);
        }
        setProtectedRoutes(current);
    };

    return {
        protectedRoutes,
        isProtected,
        setProtectedRoutes,
        toggleRoute
    };
};
