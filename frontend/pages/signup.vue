<script setup lang="ts">
import SignupForm from '~/components/domain/SignupForm.vue';

definePageMeta({
  layout: 'default'
});
</script>

<template>
  <div class="signup-page">
    <SignupForm />
  </div>
</template>

<style scoped>
.signup-page {
  @apply flex items-center justify-center min-h-[calc(100vh-10rem)] w-full px-4;
}
</style>
