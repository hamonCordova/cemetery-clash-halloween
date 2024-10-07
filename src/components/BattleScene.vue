<template>
  <primitive :object="moon" :scale="[0.03, 0.03, 0.03]" :position="[-30, 20, -30]"></primitive>
  <TresPointLight :args="['#ffffff', 30, 20, 0.9]" :power="900" :position="[-23, 19, -20]" ></TresPointLight>
  <TresDirectionalLight :args="['#ffffc1', 2]" :position="[-23, 19, -20]" />
</template>

<script setup lang="ts">
  import {useGLTF} from "@tresjs/cientos";
  import {useTresContext} from "@tresjs/core";
  import {onMounted} from "vue";

  const  { scene: moon } = await useGLTF('../static/models/scene/Moon.glb')
  const {scene} = useTresContext();

  onMounted(() => {
  })

</script>