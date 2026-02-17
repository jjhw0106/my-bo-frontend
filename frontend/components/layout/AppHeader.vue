<script setup lang="ts">
const { user, logout } = useAuth();

const handleLogout = async () => {
  await logout();
};
</script>

<template>
  <header class="navbar glass-effect">
    <NuxtLink to="/">
        <div class="brand group">
        <div class="logo">M</div>
        <h1 class="title">My App</h1>
      </div>
    </NuxtLink>
    
    <nav class="nav-menu">
      <NuxtLink to="/" class="nav-link">Home</NuxtLink>
      <NuxtLink to="/stocks" class="nav-link">주식</NuxtLink>
      <NuxtLink to="/lotto/dashboard" 
                class="nav-link" 
                :class="{'router-link-active': $route.path.startsWith('/lotto')}">로또
      </NuxtLink>
      <NuxtLink to="/my-career/overview" 
                class="nav-link" 
                :class="{'router-link-active': $route.path.startsWith('/my-career')}">My-Career
      </NuxtLink>
      
      <!-- 로그인 상태에 따른 조건부 렌더링 -->
      <div v-if="user" class="flex flex-col items-end gap-1">
        <span class="text-sm font-medium text-foreground">{{ user.name }}님 환영합니다</span>
        <button 
          @click="handleLogout" 
          class="text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          Logout
        </button>
      </div>
      <NuxtLink v-else to="/login" class="btn-primary">로그인</NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
/* Navbar Styles */
.navbar {
  @apply fixed top-0 left-0 right-0 h-16 px-6 flex items-center justify-between z-50 transition-all duration-300;
}

.brand {
  @apply flex items-center gap-3 cursor-pointer;
}

.logo {
  @apply w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 
         flex items-center justify-center font-bold text-white shadow-lg 
         group-hover:scale-110 transition-transform duration-300;
}

.title {
  @apply text-xl font-bold tracking-tight bg-clip-text text-transparent 
         bg-gradient-to-r from-white to-white/70;
}

.nav-menu {
  @apply flex items-center gap-6;
}

.nav-link {
  @apply text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative;
}

.nav-link.router-link-active {
  @apply text-primary;
}

.nav-link.router-link-active::after {
  content: '';
  @apply absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full;
}

.btn-primary {
  @apply px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold 
         hover:opacity-90 hover:translate-y-[-1px] active:translate-y-0 
         transition-all shadow-lg shadow-blue-900/20;
}
</style>
