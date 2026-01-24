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
        <NuxtLink to="/login" class="btn-demo glass-effect">
          View Demo
        </NuxtLink>
      </div>
    </div>

    <!-- Feature Grid -->
    <div class="feature-grid">
      <div class="feature-card glass-effect group">
        <div class="icon-box">
          <span class="text-2xl">📊</span>
            </div>
        <h3 class="card-title">Real-time Analytics</h3>
        <p class="card-desc">Advanced charting tools and live data feeds to keep you ahead.</p>
          </div>
      
      <div class="feature-card glass-effect group">
        <div class="icon-box">
          <span class="text-2xl">🛡️</span>
          </div>
        <h3 class="card-title">Secure Trading</h3>
        <p class="card-desc">Enterprise-grade security to protect your portfolio assets.</p>
      </div>
      
      <div class="feature-card glass-effect group">
        <div class="icon-box">
          <span class="text-2xl">⚡</span>
        </div>
        
        <h3 class="card-title">Lightning Fast</h3>
        <p class="card-desc">Optimized infrastructure ensures zero latency execution.</p>
      </div>
    </div>
  </div>
</template>

