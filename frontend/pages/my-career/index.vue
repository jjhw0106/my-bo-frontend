<script setup lang="ts">
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/my-career/overview');
    }
  ]
});
</script>
