<template>
  <div class="container">
    <h1 class="title" ref="titleRef">You died!</h1>
    <p class="description" ref="descriptionRef">Death called. You answered. Wanna retry?</p>
  </div>
</template>

<script setup lang="ts">

  import {onMounted, ref} from "vue";
  import gsap from "gsap";

  const titleRef = ref();
  const descriptionRef = ref();

  onMounted(() => {

    const timeline = gsap.timeline({delay: 0.6});
    timeline.to(titleRef.value, {
      transform: "scale(1)",
      visibility: 'visible',
      ease: 'bounce.out',
      duration: 1,
    })

    timeline.to(descriptionRef.value, {
      opacity: "1",
      ease: 'power2.out',
      duration: 0.7,
      delay: 0.6,
    }, '<')
  })

</script>

<style scoped>

  .container {
    background: rgba(0, 0, 0, 0.45);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .title {
    color: #c74902;
    font-size: 80px;
    font-family: "Metal Mania", system-ui;
    transform: scale(3);
    visibility: hidden;
  }

  .description {
    color: #858585;
    font-size: 18px;
    opacity: 0;
    margin-top: -60px;
    text-align: center;
  }

  @media only screen and (min-width: 762px) {
    .title {
      font-size: 150px;
    }

    .description {
      font-size: 30px;
      margin-top: -110px;
    }
  }


</style>