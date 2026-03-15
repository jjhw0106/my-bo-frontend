<script setup lang="ts">
definePageMeta({
  layout: 'default'
});
</script>

<template>
  <div class="page-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="badge">
        🚀 The Future of Stock Trading
    </div>

      <h1 class="hero-title">
        Trade Smarter with <br/>
        <span class="highlight-text">
          Premium Insights
        </span>
      </h1>
      
      <p class="hero-desc">
        Experience real-time market data, advanced analytics, and a beautiful interface designed for modern investors.
      </p>
      
      <div class="cta-group">
        <NuxtLink to="/stocks" class="btn-start">
          Start Trading Now
        </NuxtLink>
        <NuxtLink to="/auth/login" class="btn-demo glass-effect">
          View Demo
        </NuxtLink>
      </div>
    </div>

    <!-- Feature Grid -->
    <div class="feature-grid">
      <NuxtLink to="/my-apps" class="feature-card glass-effect group hover:border-blue-500/50 transition-all">
        <div class="icon-box group-hover:bg-blue-500/20 transition-colors">
          <span class="text-2xl">📦</span>
        </div>
        <h3 class="card-title">My Apps</h3>
        <p class="card-desc">내가 개발한 정적 페이지를 다운로드 받아보세요.</p>
      </NuxtLink>

      <NuxtLink to="/my-career/overview" class="feature-card glass-effect group hover:border-blue-500/50 transition-all">
        <div class="icon-box group-hover:bg-blue-500/20 transition-colors">
          <span class="text-2xl">💼</span>
        </div>
        <h3 class="card-title">My Career</h3>
        <p class="card-desc">채용 플랫폼 지원 내역을 한눈에 관리하세요.</p>
      </NuxtLink>

      <NuxtLink to="/settings" class="feature-card glass-effect group hover:border-blue-500/50 transition-all">
        <div class="icon-box group-hover:bg-blue-500/20 transition-colors">
          <span class="text-2xl">⚙️</span>
        </div>
        <h3 class="card-title">Management</h3>
        <p class="card-desc">프로필, 알림, 접근 권한 등을 설정합니다.</p>
      </NuxtLink>
    </div>
  </div>
</template>

