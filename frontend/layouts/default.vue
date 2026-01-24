<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue';
</script>

<template>
  <div class="layout-container">
    <!-- Top Navbar -->
    <AppHeader />

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

<style scoped>
.layout-container {
  @apply min-h-screen bg-background flex flex-col relative overflow-hidden;
}

.main-content {
  @apply flex-1 pt-24 px-4 pb-12 w-full max-w-7xl mx-auto z-10;
}

.footer {
  @apply py-6 text-center text-sm text-muted-foreground border-t border-border mt-auto;
}
</style>
