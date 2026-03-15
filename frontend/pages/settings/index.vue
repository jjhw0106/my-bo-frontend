<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: [
    function () {
      return navigateTo('/settings/my-profile');
    }
  ]
});
</script>
