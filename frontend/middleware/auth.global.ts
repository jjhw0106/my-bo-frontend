export default defineNuxtRouteMiddleware((to, from) => {
  // 1. 필요한 Hook 가져오기
  const { isProtected } = usePagePermissions();
  const { user } = useAuth();

  // 2. 현재 이동하려는 페이지(to.path)가 보호된 페이지인지 확인
  if (isProtected(to.path)) {
    // 3. 로그인이 안 되어 있다면 로그인 페이지로 리다이렉트
    if (!user.value) {
      // 로그인 후 원래 페이지로 돌아오기 위해 redirect 파라미터 추가 가능 (선택 사항)
      return navigateTo('/login');
    }
  }

  // (선택 사항) 이미 로그인한 유저가 로그인 페이지에 접근하려 할 때 홈으로 보냄
  if (to.path === '/login' && user.value) {
    return navigateTo('/');
  }
});
