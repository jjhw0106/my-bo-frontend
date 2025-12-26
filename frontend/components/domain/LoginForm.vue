<script setup lang="ts">
import { ref } from 'vue';

const { login, loading, error } = useAuth();
const router = useRouter();

const form = ref({
  email: 'admin@example.com',
  password: ''
});

const handleLogin = async () => {
  const success = await login(form.value.email, form.value.password);
  if (success) {
    router.push('/');
  }
};
</script>

<template>
  <div class="login-card glass-effect animate-fade-in">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-primary mb-2">Welcome Back</h2>
      <p class="text-muted-foreground">프리미엄 대시보드에 로그인하세요</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div class="space-y-2">
        <label for="email" class="text-sm font-medium text-foreground ml-1">Email</label>
        <input 
          id="email"
          v-model="form.email"
          type="email" 
          class="form-input"
          placeholder="admin@example.com"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="password" class="text-sm font-medium text-foreground ml-1">Password</label>
        <input 
          id="password"
          v-model="form.password"
          type="password" 
          class="form-input"
          placeholder="••••••••"
          required
        />
      </div>

      <div v-if="error" class="text-destructive text-sm text-center bg-destructive/10 p-2 rounded">
        {{ error }}
      </div>

      <button 
        type="submit" 
        class="submit-btn"
        :disabled="loading"
      >
        <span v-if="loading" class="loading-spinner"></span>
        {{ loading ? '로그인 중...' : '로그인' }}
      </button>
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
