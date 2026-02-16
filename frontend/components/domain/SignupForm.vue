<script setup lang="ts">
import { ref } from 'vue';

const { signup, loading, error } = useAuth();
const router = useRouter();

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  nickName: ''
});

const validationError = ref<string | null>(null);

const validateForm = () => {
  if (form.value.password.length < 8) {
    validationError.value = '비밀번호는 최소 8자 이상이어야 합니다';
    return false;
  }
  if (form.value.password !== form.value.confirmPassword) {
    validationError.value = '비밀번호가 일치하지 않습니다';
    return false;
  }
  if (form.value.nickName.length < 2) {
    validationError.value = '닉네임은 최소 2자 이상이어야 합니다';
    return false;
  }
  validationError.value = null;
  return true;
};

const handleSignup = async () => {
  if (!validateForm()) return;

  const success = await signup(
    form.value.email,
    form.value.password,
    form.value.nickName
  );

  if (success) {
    router.push('/');
  }
};
</script>

<template>
  <div class="login-card glass-effect animate-fade-in">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-primary mb-2">Create Account</h2>
      <p class="text-muted-foreground">새로운 계정을 생성하세요</p>
    </div>

    <form @submit.prevent="handleSignup" class="space-y-6">
      <!-- Email -->
      <div class="space-y-2">
        <label for="email" class="text-sm font-medium text-foreground ml-1">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="form-input"
          placeholder="example@email.com"
          required
        />
      </div>

      <!-- Password -->
      <div class="space-y-2">
        <label for="password" class="text-sm font-medium text-foreground ml-1">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="form-input"
          placeholder="••••••••"
          minlength="8"
          required
        />
        <p class="text-xs text-muted-foreground ml-1">최소 8자 이상</p>
      </div>

      <!-- Confirm Password -->
      <div class="space-y-2">
        <label for="confirmPassword" class="text-sm font-medium text-foreground ml-1">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          class="form-input"
          placeholder="••••••••"
          required
        />
      </div>

      <!-- Nickname -->
      <div class="space-y-2">
        <label for="nickName" class="text-sm font-medium text-foreground ml-1">Nickname</label>
        <input
          id="nickName"
          v-model="form.nickName"
          type="text"
          class="form-input"
          placeholder="사용할 닉네임"
          minlength="2"
          required
        />
      </div>

      <!-- Error Display -->
      <div v-if="validationError || error"
           class="text-destructive text-sm text-center bg-destructive/10 p-2 rounded">
        {{ validationError || error }}
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="submit-btn"
        :disabled="loading"
      >
        <span v-if="loading" class="loading-spinner"></span>
        {{ loading ? '가입 중...' : '회원가입' }}
      </button>

      <!-- Login Link -->
      <div class="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?
        <NuxtLink to="/login" class="text-primary hover:underline ml-1">
          로그인
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<style scoped>
.login-card {
  @apply p-8 rounded-2xl border border-border w-full max-w-md backdrop-blur-xl shadow-2xl mx-auto;
}

.form-input {
  @apply w-full px-4 py-3 rounded-lg bg-background/50 border border-border
         focus:border-primary focus:ring-2 focus:ring-primary/20
         outline-none transition-all placeholder:text-muted-foreground text-foreground text-left;
}

.submit-btn {
  @apply w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold
         hover:opacity-90 hover:translate-y-[-1px] active:translate-y-0
         transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)]
         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2;
}

.loading-spinner {
  @apply w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin;
}
</style>
