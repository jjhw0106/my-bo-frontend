<script setup lang="ts">
import LoginForm from '~/components/domain/LoginForm.vue';

definePageMeta({
  layout: 'default'
});
</script>

<template>
  <div class="login-page">
    <LoginForm />
  </div>
</template>

<style scoped>
.login-page {
  @apply flex items-center justify-center min-h-[calc(100vh-10rem)] w-full px-4;
}
</style>
