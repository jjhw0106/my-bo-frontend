<script setup lang="ts">
const { fetchHistory } = useScraper();
definePageMeta({
  layout: 'dashboard',
  middleware: [
    function (to, from) {
      return navigateTo('/my-career/overview');
    }
  ]
});

</script>
