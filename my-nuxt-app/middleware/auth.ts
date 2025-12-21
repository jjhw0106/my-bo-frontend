export default defineNuxtRouteMiddleware((to, from) => {
  // 간단한 인증 체크 예시
  const isAuthenticated = false; // 실제 구현 시 Composables(useAuth) 등을 사용

  if (to.meta.requiresAuth && !isAuthenticated) {
    return navigateTo('/login');
  }
});
