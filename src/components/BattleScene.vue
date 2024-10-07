<template>

  <!-- Moon -->
  <primitive :object="resources.get('moon').scene" :scale="[0.02, 0.02, 0.02]" :position="[-30, 15, -30]"></primitive>
  <TresPointLight :args="['#ffffff', 30, 20, 0.9]" :power="900" :position="[-23, 15, -20]" ></TresPointLight>
  <TresDirectionalLight :args="['#ffffc1', 2]" :position="[-23, 15, -20]" />

  <!-- Tree -->
  <primitive :object="resources.get('deadTree').scene" :scale="[0.9, 0.9, 0.9]" :position="[24, 0, -21]"></primitive>
  <!--PumpKin-->
  <Pumpkin :position="[22, 0.7, -20]" />

  <!-- asdsad -->
  <primitive :object="resources.get('crypt').scene" :scale="[1.3, 1.3, 1.3]" :position="[-5, 0, -21]"></primitive>

  <BattleRing />

</template>

<script setup lang="ts">
import {useRenderLoop, useTresContext} from "@tresjs/core";
  import {onMounted} from "vue";
  import {useResources} from "@/composable/useResources";
  import Pumpkin from "@/components/objects/Pumpkin.vue";
  import BattleRing from "@/components/objects/BattleRing.vue";
  import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
  import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
  import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
  import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {Vector2} from "three";
import {GammaCorrectionShader} from "three/examples/jsm/shaders/GammaCorrectionShader";

  const resources = useResources();
  const { renderer, scene, camera } = useTresContext();
  const composer = new EffectComposer(renderer.value);
  const {onLoop} = useRenderLoop();


  onMounted(() => {


    const renderPass = new RenderPass(scene.value, camera.value);
    composer.addPass(renderPass);

    // Adicionar efeito de Bloom
    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.21;
    bloomPass.strength = 0.2; // Você pode ajustar a intensidade aqui
    bloomPass.radius = 0.45;
 //   composer.addPass(bloomPass);

  })

  onLoop(() => {
    if (composer) {
      composer.render()
    }
  })

</script>
<style>
a {
  background: rgba(255, 167, 5, 0.67);
}
</style>