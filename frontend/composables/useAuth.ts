import type { User } from '~/types/auth';

export const useAuth = () => {
  const config = useRuntimeConfig();

  // 사용자 정보 영구 저장을 위해 useCookie 사용
  const user = useCookie<User | null>('user', {
    default: () => null,
    watch: true
  });

  const isAuthenticated = computed(() => !!user.value);
  const loading = useState('authLoading', () => false);
  const error = useState<string | null>('authError', () => null);

  // 로그인 (API 연동)
  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const data = await $fetch(`${config.public.apiBase}/auth/login`, {
        method: 'POST',
        body: { email, password },
        credentials: 'include' // 쿠키(HttpOnly) 수신 및 전송 허용
      });

      // 성공 시 사용자 정보 업데이트 (쿠키에 저장됨)
      user.value = { email: data as string, name: 'User' };
      localStorage.setItem('last_user_id', data as string);
      return true;
    } catch (e: any) {
      // 에러 처리
      error.value = e.data?.message || '로그인 실패';
      return false;
    } finally {
      loading.value = false;
    }

  };

  // 회원가입 (API 연동)
  const signup = async (email: string, password: string, nickName: string) => {
    loading.value = true;
    error.value = null;

    try {
      // 회원가입 API 호출
      await $fetch(`${config.public.apiBase}/auth/sign-up`, {
        method: 'POST',
        body: { email, password, nickName },
        credentials: 'include'
      });

      // 성공 시 자동 로그인
      const loginSuccess = await login(email, password);
      return loginSuccess;
    } catch (e: any) {
      if (e.status === 409) {
        error.value = '이미 사용 중인 이메일입니다';
      } else if (e.data?.message) {
        error.value = e.data.message;
      } else {
        error.value = '회원가입 실패';
      }
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null; // 쿠키 삭제
    localStorage.clear()
    return navigateTo('/login');
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout
  };
};
