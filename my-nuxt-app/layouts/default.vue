<script setup lang="ts">
const { user, logout } = useAuth();

const handleLogout = async () => {
  await logout();
};
</script>

<template>
  <div class="layout-container">
    <!-- Top Navbar -->
    <header class="navbar glass-effect">
      <div class="brand">
        <div class="logo">M</div>
        <h1 class="title">My App</h1>
      </div>
      
      <nav class="nav-menu">
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <NuxtLink to="/stocks" class="nav-link">주식</NuxtLink>
        
        <!-- 로그인 상태에 따른 조건부 렌더링 -->
        <div v-if="user" class="flex flex-col items-end gap-1">
          <span class="text-sm font-medium text-foreground">{{ user.email }}님 환영합니다</span>
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

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      © 2025 My App. All rights reserved.
    </footer>
  </div>
</template>