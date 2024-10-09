<template>

  <!-- Moon -->
  <primitive :object="resources.get('moon').scene" :scale="[0.02, 0.02, 0.02]" :position="[-30, 15, -30]"></primitive>
  <TresPointLight :args="['#ffffff', 30, 20, 0.9]" :power="900" :position="[-23, 15, -20]" ></TresPointLight>
  <TresDirectionalLight :args="['#ffffc1', 2]" :position="[-23, 15, -20]" />
  <TresDirectionalLight :args="['#fff', 2]" :position="[-27, 10, -27]" cast-shadow :shadow-mapSize-height="512" :shadow-mapSize-width="512" />

  <!-- Tree -->
  <primitive :object="resources.get('deadTree').scene" :scale="[0.9, 0.9, 0.9]" :position="[24, 0, -21]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[0.8, 0.8, 0.8]" :position="[20, 0, -23]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[0.6, 0.6, 0.6]" :position="[5, 0, -30]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[0.6, 0.6, 0.6]" :position="[9, 0, -30]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[0.75, 0.75, 0.75]" :position="[15, 0, -24]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1, 1, 1]" :position="[10, 0, -27]"></primitive>
  <primitive :object="resources.get('smallDeadTree').scene" :scale="[1, 1, 1]" :position="[14, 0, -29]"></primitive>
  <primitive :object="resources.get('smallDeadTree').scene" :scale="[1.2, 1.2, 1.2]" :position="[18, 0, -22]"></primitive>
  <primitive :object="resources.get('deadTree', 0.3).scene" :scale="[0.8, 0.8, 0.8]" :position="[18, 0, -35]"></primitive>
  <primitive :object="resources.get('deadTree', 0.4).scene" :scale="[0.8, 0.8, 0.8]" :position="[13, 0, -32]"></primitive>
  <primitive :object="resources.get('deadTree', 0.4).scene" :scale="[0.8, 0.8, 0.8]" :position="[22, 0, -32]"></primitive>

  <primitive :object="resources.get('deadTree').scene" :scale="[0.7, 0.7, 0.7]" :position="[-24, 0, -21]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[0.8, 0.8, 0.8]" :position="[-20, 0, -23]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[0.6, 0.6, 0.6]" :position="[-5, 0, -30]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[0.6, 0.6, 0.6]" :position="[-9, 0, -30]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[0.75, 0.75, 0.75]" :position="[-15, 0, -24]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1, 1, 1]" :position="[-10, 0, -27]"></primitive>
  <primitive :object="resources.get('smallDeadTree').scene" :scale="[1, 1, 1]" :position="[-14, 0, -29]"></primitive>
  <primitive :object="resources.get('smallDeadTree').scene" :scale="[1.2, 1.2, 1.2]" :position="[-18, 0, -22]"></primitive>
  <primitive :object="resources.get('deadTree', 0.3).scene" :scale="[0.8, 0.8, 0.8]" :position="[-18, 0, -35]"></primitive>
  <primitive :object="resources.get('deadTree', 0.4).scene" :scale="[0.8, 0.8, 0.8]" :position="[-13, 0, -32]"></primitive>
  <primitive :object="resources.get('deadTree', 0.4).scene" :scale="[0.8, 0.8, 0.8]" :position="[-22, 0, -32]"></primitive>


  <primitive :object="resources.get('deadTree', 0.2).scene" :scale="[0.6, 0.6, 0.6]" :position="[-2, 0, -35]"></primitive>
  <primitive :object="resources.get('deadTree', 0.5).scene" :scale="[0.8, 0.8, 0.8]" :position="[13, 0, -35]"></primitive>
  <primitive :object="resources.get('deadTree', 0.5).scene" :scale="[0.8, 0.8, 0.8]" :position="[-5, 0, -32]"></primitive>
  <primitive :object="resources.get('deadTree', 0.2).scene" :scale="[0.8, 0.8, 0.8]" :position="[-1, 0, -39]"></primitive>
  <primitive :object="resources.get('deadTree', 0.2).scene" :scale="[0.8, 0.8, 0.8]" :position="[7, 0, -39]"></primitive>



  <!--PumpKin-->
  <Pumpkin :position="[22, 0.7, -20]" />

  <!-- Crypt -->
  <primitive :object="resources.get('crypt').scene" :scale="[1.3, 1.3, 1.3]" :position="[-5, 0, -22]"></primitive>
  <primitive :object="resources.get('skull').scene" :position="[-7, 0.01, -16]" :rotation="[0, 0.6, 0]"></primitive>
  <primitive :object="resources.get('bone').scene" :position="[-10, 0.01, -18]"></primitive>
  <primitive :object="resources.get('bone').scene" :position="[-9.5, 0.01, -18.2]" :rotation="[0, 2.3, 0]"></primitive>
  <Candles :position="[-8, 0.01, -16]" />
  <Candles :position="[-9, 0.01, -16.5]" />

  <!--Path-->
  <primitive :object="resources.get('path').scene" :scale="[1.3, 1.3, 1.3]" :position="[-9, 0.01, -14.2]"></primitive>
  <primitive :object="resources.get('path').scene" :scale="[1.3, 1.3, 1.3]" :position="[-6.5, 0.01, -14.2]"></primitive>
  <primitive :object="resources.get('path').scene" :scale="[1.3, 1.3, 1.3]" :position="[-3.9, 0.01, -14.2]"></primitive>
  <primitive :object="resources.get('path').scene" :scale="[1.3, 1.3, 1.3]" :position="[-1.3, 0.01, -14.2]"></primitive>
  <primitive :object="resources.get('path').scene" :scale="[1.3, 1.3, 1.3]" :position="[1.4, 0.01, -14.2]"></primitive>
  <primitive :object="resources.get('path').scene" :scale="[1.3, 1.3, 1.3]" :position="[1.4, 0.01, -16.7]"></primitive>
  <primitive :object="resources.get('path').scene" :scale="[1.3, 1.3, 1.3]" :position="[1.4, 0.01, -19.2]"></primitive>
  <primitive :object="resources.get('path').scene" :scale="[1.3, 1.3, 1.3]" :position="[1.4, 0.01, -21.8]"></primitive>
  <primitive :object="resources.get('path').scene" :scale="[1.3, 1.3, 1.3]" :position="[1.4, 0.01, -24.3]"></primitive>
  <primitive :object="resources.get('path').scene" :scale="[1.3, 1.3, 1.3]" :position="[1.4, 0.01, -26.8]"></primitive>
  <primitive :object="resources.get('path', 0.8).scene" :scale="[1.3, 1.3, 1.3]" :position="[1.4, 0.01, -29.4]"></primitive>
  <primitive :object="resources.get('path', 0.4).scene" :scale="[1.3, 1.3, 1.3]" :position="[1.4, 0.01, -32]"></primitive>
  <primitive :object="resources.get('path', 0.2).scene" :scale="[1.3, 1.3, 1.3]" :position="[1.4, 0.01, -34.5]"></primitive>
  <primitive :object="resources.get('path', 0.1).scene" :scale="[1.3, 1.3, 1.3]" :position="[1.4, 0.01, -37]"></primitive>


  <!--Sepultura-->
  <Candles :position="[3.5, 0.01, -25.5]" />
  <primitive :object="resources.get('shovel').scene" :scale="[0.8, 0.8, 0.8]" :position="[9, 1.2, -17.8]" :rotation="[-0.2, -0.5, 0.1]"></primitive>
  <primitive :object="resources.get('graveUnder').scene" :scale="[1.3, 1.3, 1.3]" :position="[6, 0.3, -21.8]"></primitive>
  <primitive :object="resources.get('coffin').scene" :scale="[1.1, 1.1, 1.1]" :position="[10, 0.01, -21.8]"></primitive>
  <primitive :object="resources.get('coffin').scene" :scale="[1.1, 1.1, 1.1]" :position="[11, 0.8, -19.8]" :rotation="[0.3, 0.3, -0.5]"></primitive>
  <primitive :object="resources.get('bone').scene" :scale="[0.7, 0.7, 0.7]" :position="[8, 0, -16.8]" :rotation="[0, 1, 0]"></primitive>
  <primitive :object="resources.get('bone').scene" :scale="[0.7, 0.7, 0.7]" :position="[7.5, 0, -17.5]" :rotation="[0, 1.6, 0]"></primitive>
  <primitive :object="resources.get('bone').scene" :scale="[0.7, 0.7, 0.7]" :position="[8, 0, -17.8]" :rotation="[0, 1.3, 0]"></primitive>
  <primitive :object="resources.get('grave').scene" :scale="[1.2, 1.2, 1.2]" :position="[5.9, 0, -25.8]"></primitive>
  <primitive :object="resources.get('ribcage').scene" :scale="[1.2, 1.2, 1.2]" :position="[5.9, 0.3, -16.8]" :rotation="[1, 2.5, 1]"></primitive>
  <Lantern :position="[4.5, 0.3, -14.8]" />
  <Lantern :position="[14, 0.01, -18.5]" />

  <!-- Tree -->
  <primitive :object="resources.get('deadTree').scene" :scale="[0.7, 0.7, 0.7]" :position="[13, 0, -15]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[0.7, 0.7, 0.7]" :position="[17, 0, -16]"></primitive>
  <!--PumpKin-->
  <Pumpkin :position="[10, 0.7, -15]" />
  <Pumpkin :position="[14, 0.7, 8]" />


  <BattleRing />

</template>

<script setup lang="ts">
import {useRenderLoop, useTresContext, vLightHelper} from "@tresjs/core";
  import {onMounted} from "vue";
  import {useResources} from "@/composable/useResources";
  import Pumpkin from "@/components/objects/Pumpkin.vue";
  import BattleRing from "@/components/objects/BattleRing.vue";
  import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
  import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
  import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
  import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
  import {Mesh, Vector2} from "three";
  import {GammaCorrectionShader} from "three/examples/jsm/shaders/GammaCorrectionShader";
  import Candles from "@/components/objects/Candles.vue";
  import Lantern from "@/components/objects/Lantern.vue";

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
   // composer.addPass(bloomPass);

    generateGrass();

    setTimeout(() => {
      renderer.value.shadowMap.autoUpdate = false;
    }, 1000)


  })

  const generateGrass = () => {

    for (let i = 0; i < 100; i++) {
      const isGrassRock = i % 5 === 0;
      const grassScene = resources.get(
           isGrassRock ? 'rockGrass' : 'grass'
      ).scene;

      const angle = Math.random() * Math.PI * 2;
      const radius =  25 * Math.random() + 4;

      grassScene.position.x = Math.sin(angle) * radius;
      grassScene.position.z = Math.cos(angle) * radius;
      grassScene.position.y = Math.random() * 0.2;

      if (!isGrassRock) {
        grassScene.scale.set(0.5, 0.5, 0.5)
        grassScene.position.y = Math.random() - 0.8
      }

      scene.value.add(grassScene);
    }

  }

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