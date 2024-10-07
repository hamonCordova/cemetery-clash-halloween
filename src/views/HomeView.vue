<template>
  <div class="loading">
    <h1>Loading...</h1>
  </div>
</template>

<script setup lang="ts">
  import {useResources} from "@/composable/useResources";
  import {onMounted} from "vue";
  import router from "@/router";
  import {useEventBus} from "@vueuse/core";

  const resources = useResources();

  onMounted(() => {

      resources.load(() => {
        console.warn(resources.resources)
        router.push('/game')
      });
  })
</script>

<style scoped>
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
    width: 100vw;
    max-width: 100%;
    height: 100vh;
  }

  h1 {
    color: #fff;
  }
</style>