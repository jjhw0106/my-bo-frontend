<script setup lang="ts">
const { fetchHistory } = useScraper();
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/my-career/overview');
    }
  ]
});

</script>
