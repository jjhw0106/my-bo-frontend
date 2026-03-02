<script setup lang="ts">
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/settings/my-profile');
    }
  ]
});
</script>
