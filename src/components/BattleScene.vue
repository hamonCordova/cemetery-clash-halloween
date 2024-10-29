<template>

  <TresDirectionalLight :args="['#ffffc1', 2]" :position="[-23, 15, -20]" />
  <TresDirectionalLight :args="['#fff', 2]" :position="[-27, 10, -27]" cast-shadow :mapSize="[256, 256]" />
<!--  <TresDirectionalLight v-if="isMobile" :args="['#f65a00', 2]" :position="[-20, 3, 6]" :rotation="[0, 0.09, 0]" cast-shadow :mapSize="[256, 256]" />-->
  <TresPointLight v-if="isMobile" :color="'#d67a26'" :intensity="20" :distance="20" :decay="0.3" :power="300" :position="[-19, 3, 3]"  cast-shadow :mapSize="[256, 256]" />
  <TresPointLight v-if="isMobile" :color="'#c74902'" :intensity="20" :distance="20" :decay="0.3" :power="300" :position="[12, 2, -16]" cast-shadow :mapSize="[256, 256]" />
  <TresPointLight v-if="isMobile" :color="'#c74902'" :intensity="20" :distance="20" :decay="0.3" :power="300" :position="[26, 1.6, 2]"  cast-shadow :mapSize="[256, 256]" />
  <TresPointLight v-if="isMobile" :color="'#6f0eff'" :intensity="2" :distance="5" :decay="0.3" :power="100" :position="[-8, 2, -16]"  cast-shadow :mapSize="[256, 256]" />

  <TresPointLight v-if="isMobile" :color="'#6f0eff'" :intensity="2.5" :distance="13" :decay="0.35" :power="100" :position="[-0.5, 2, 25]"  cast-shadow :mapSize="[256, 256]" />

  <TresPointLight v-if="isMobile" :color="'#d67a26'" :intensity="20" :distance="20" :decay="0.3" :power="300" :position="[-19, 2, -18]"  cast-shadow :mapSize="[256, 256]" />
  <TresHemisphereLight v-if="isMobile" :args="['#6f0eff', '#d67a26', 1]" />
  <TresAmbientLight v-if="isMobile" :intensity="0.4" />

  <!-- Tree -->
  <primitive :object="resources.get('deadTree').scene" :scale="[1.9, 1.9, 1.9]" :position="[24, 0, -21]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1.9, 1.9, 1.9]" :position="[20, 0, -23]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1.4, 1.4, 1.4]" :position="[5, 0, -30]"></primitive>
  <primitive :object="resources.get('deadTree2').scene" :scale="[0.7, 0.7, 0.7]" :position="[9, 0, -30]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1.6, 1.6, 1.6]" :position="[15, 0, -24]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1.9, 1.9, 1.9]" :position="[10, 0, -27]"></primitive>
  <primitive :object="resources.get('smallDeadTree').scene" :scale="[1, 1, 1]" :position="[14, 0, -29]"></primitive>
  <primitive :object="resources.get('smallDeadTree').scene" :scale="[1.4, 1.4, 1.4]" :position="[18, 0, -22]"></primitive>
  <primitive :object="resources.get('deadTree', 0.3).scene" :scale="[1.4, 1.4, 1.4]" :position="[18, 0, -35]"></primitive>
  <primitive :object="resources.get('deadTree', 0.4).scene" :scale="[1.4, 1.4, 1.4]" :position="[13, 0, -32]"></primitive>
  <primitive :object="resources.get('deadTree2', 0.4).scene" :scale="[0.8, 0.8, 0.8]" :position="[22, 0, -32]"></primitive>

  <primitive :object="resources.get('deadTree').scene" :scale="[1.4, 1.4, 1.4]" :position="[-24, 0, -21]"></primitive>
  <primitive :object="resources.get('deadTree2').scene" :scale="[0.9, 0.9, 0.9]" :position="[-20, 0, -23]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1.4, 1.4, 1.4]" :position="[-5, 0, -30]"></primitive>
  <primitive :object="resources.get('deadTree2').scene" :scale="[0.65, 0.65, 0.65]" :position="[-9, 0, -30]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1.6, 1.6, 1.6]" :position="[-15, 0, -24]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1.6, 1.6, 1.6]" :position="[-15, 0, -24]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1.9, 1.9, 1.9]" :position="[-10, 0, -27]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1.7, 1.7, 1.7]" :position="[-32, 0, -17]"></primitive>
  <primitive :object="resources.get('deadTree2').scene" :scale="[0.9, 0.9, 0.9]" :position="[-32, 0, -25]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[2.1, 2.1, 2.1]" :position="[-32, 0, -10]"></primitive>
  <primitive :object="resources.get('smallDeadTree').scene" :scale="[1, 1, 1]" :position="[-28, 0, -10]"></primitive>
  <primitive :object="resources.get('smallDeadTree').scene" :scale="[1, 1, 1]" :position="[-14, 0, -29]"></primitive>
  <primitive :object="resources.get('smallDeadTree').scene" :scale="[1.4, 1.4, 1.4]" :position="[-16, 0, -22]"></primitive>
  <primitive :object="resources.get('deadTree', 0.3).scene" :scale="[1.4, 1.4, 1.4]" :position="[-18, 0, -35]"></primitive>
  <primitive :object="resources.get('deadTree', 0.4).scene" :scale="[1.4, 1.4, 1.4]" :position="[-13, 0, -32]"></primitive>
  <primitive :object="resources.get('deadTree', 0.4).scene" :scale="[1.4, 1.4, 1.4]" :position="[-22, 0, -32]"></primitive>

  <primitive :object="resources.get('deadTree2', 0.2).scene" :scale="[1, 1, 1]" :position="[-2, 0, -35]"></primitive>
  <primitive :object="resources.get('deadTree', 0.5).scene" :scale="[1.4, 1.4, 1.4]" :position="[13, 0, -35]"></primitive>
  <primitive :object="resources.get('deadTree2', 0.5).scene" :scale="[1.1, 1.1, 1.1]" :position="[-5, 0, -32]"></primitive>
  <primitive :object="resources.get('deadTree', 0.2).scene" :scale="[1.4, 1.4, 1.4]" :position="[-1, 0, -39]"></primitive>
  <primitive :object="resources.get('deadTree', 0.2).scene" :scale="[1.4, 1.4, 1.4]" :position="[7, 0, -39]"></primitive>

  <!--PumpKin-->
  <Pumpkin :render-light="!isMobile" :position="[22, 0.7, -20]" />

  <!-- Crypt -->
  <primitive :object="resources.get('crypt').scene" :scale="[1.3, 1.3, 1.3]" :position="[-5, 0, -22]"></primitive>
  <primitive :object="resources.get('cobweb').scene" :scale="[2, 2, 2]" :position="[-2, 0, -17]" :rotation="[0, -0.5, 0]"></primitive>
  <primitive :object="resources.get('skull').scene" :position="[-7, 0.01, -16]" :rotation="[0, 0.6, 0]"></primitive>
  <primitive :object="resources.get('bone').scene" :position="[-10, 0.01, -18]"></primitive>
  <primitive :object="resources.get('bone').scene" :position="[-9.5, 0.01, -18.2]" :rotation="[0, 2.3, 0]"></primitive>
  <Candles :render-light="!isMobile" :position="[-8, 0.01, -16]" />
  <Pumpkin :render-light="!isMobile" :position="[-19, 0.7, -25.5]" :rotation="[0, -2.3, 0]" />

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
  <Candles :render-light="!isMobile" :position="[3.5, 0.01, -25.5]" />
  <primitive :object="resources.get('shovel').scene" :scale="[0.8, 0.8, 0.8]" :position="[9, 1.2, -17.8]" :rotation="[-0.2, -0.5, 0.1]"></primitive>
  <primitive :object="resources.get('graveUnder').scene" :scale="[1.3, 1.3, 1.3]" :position="[6, 0.3, -21.8]"></primitive>
  <primitive :object="resources.get('coffin').scene" :scale="[1.1, 1.1, 1.1]" :position="[10, 0.01, -21.8]"></primitive>
  <primitive :object="resources.get('coffin').scene" :scale="[1.1, 1.1, 1.1]" :position="[11, 0.8, -19.8]" :rotation="[0.3, 0.3, -0.5]"></primitive>
  <primitive :object="resources.get('bone').scene" :scale="[0.7, 0.7, 0.7]" :position="[8, 0, -16.8]" :rotation="[0, 1, 0]"></primitive>
  <primitive :object="resources.get('bone').scene" :scale="[0.7, 0.7, 0.7]" :position="[7.5, 0, -17.5]" :rotation="[0, 1.6, 0]"></primitive>
  <primitive :object="resources.get('bone').scene" :scale="[0.7, 0.7, 0.7]" :position="[8, 0, -17.8]" :rotation="[0, 1.3, 0]"></primitive>
  <primitive :object="resources.get('grave').scene" :scale="[1.2, 1.2, 1.2]" :position="[5.9, 0, -25.8]"></primitive>
  <primitive :object="resources.get('ribcage').scene" :scale="[1.2, 1.2, 1.2]" :position="[5.9, 0.3, -16.8]" :rotation="[1, 2.5, 1]"></primitive>
  <Lantern :render-light="!isMobile" :position="[4.5, 0, -14.8]" />

  <!-- Tree -->
  <primitive :object="resources.get('deadTree2').scene" :scale="[1, 1, 1]" :position="[13, 0, -15]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1.2, 1.2, 1.2]" :position="[17, 0, -16]"></primitive>
  <Pumpkin :render-light="!isMobile" :position="[10, 0.7, -15]" />
  <Pumpkin :render-light="!isMobile" :position="[14, 0.7, 8]" />

  <!-- Left side -->
  <primitive :object="resources.get('cemetary').scene" :scale="[4, 4, 4]" :position="[-19, 1, -12]"></primitive>
  <primitive :object="resources.get('cobweb').scene" :scale="[2.6, 2.6, 2.6]" :position="[-19.5, 1, -12.5]"></primitive>
  <Candles :render-light="!isMobile" :position="[-15.5, 1, -10.5]" />
  <Pumpkin :render-light="!isMobile" :position="[-14.5, 0.65, -4]" :rotation="[0, -2, 0]" />

  <template v-for="item in 10" :key="item">
    <primitive :object="resources.get('path').scene" :scale="[1.3, 1.3, 1.3]" :position="[-18.5, 0.01, (-9.5 - (2.5 * -item))]"></primitive>
  </template>
  <PostLantern :render-light="!isMobile" :position="[-21.5, 0, -7]" :rotation="[0, 0.7, 0]" />
  <primitive :object="resources.get('crypt').scene" :scale="[1.3, 1.3, 1.3]" :position="[-26, 0, -2]" :rotation="[0, 1.3, 0]"></primitive>
  <primitive :object="resources.get('crypt').scene" :scale="[1.3, 1.3, 1.3]" :position="[-26, 0, 9]" :rotation="[0, 1.6, 0]"></primitive>
  <PostLantern :render-light="!isMobile" :position="[-21, 0, 3.5]" :rotation="[0, 1, 0]" />
  <Pumpkin :render-light="!isMobile" :position="[-21.5, 0.65, 13]" :rotation="[0, -2.5, 0]" />
  <primitive :object="resources.get('coffin2').scene" :scale="[1, 1, 1]" :position="[-21, 1.5, 6]" :rotation="[Math.PI / 2, 0.2, -1.2]"></primitive>
  <primitive :object="resources.get('graveMarker').scene" :scale="[1, 1, 1]" :position="[-15, 0, 6]" :rotation="[0, 0.5, 0]"></primitive>
  <primitive :object="resources.get('graveMarker').scene" :scale="[1, 1, 1]" :position="[-15, 0, 9]" :rotation="[0, 0.2, 0]"></primitive>
  <primitive :object="resources.get('graveMarker').scene" :scale="[1, 1, 1]" :position="[-15, 0, 2]" :rotation="[0, 1.5, 0]"></primitive>


  <!-- Right side --><!-- Right side -->

  <primitive :object="resources.get('gravestone').scene" :scale="[0.8, 0.8, 0.8]" :position="[17, 0, -14]" :rotation="[0, 0.3, 0]"></primitive>
  <primitive :object="resources.get('graveMarker').scene" :scale="[0.9, 0.9, 0.9]" :position="[18, 0, -9]" :rotation="[0, -0.2, 0]"></primitive>
  <primitive :object="resources.get('damagedGrave').scene" :scale="[0.8, 0.8, 0.8]" :position="[22, 0, -7]" :rotation="[0, -0.3, 0]"></primitive>
  <primitive :object="resources.get('gravestone').scene" :scale="[0.8, 0.8, 0.8]" :position="[24, 0, -13]" :rotation="[0, 0.4, 0]"></primitive>
  <primitive :object="resources.get('graveMarker').scene" :scale="[0.9, 0.9, 0.9]" :position="[26, 0, -8]" :rotation="[0, -0.1, 0]"></primitive>
  <primitive :object="resources.get('skull').scene" :scale="[0.6, 0.6, 0.6]" :position="[28, 0, -11]" :rotation="[0, 0.2, 0]"></primitive>

  <primitive :object="resources.get('graveMarker').scene" :scale="[0.9, 0.9, 0.9]" :position="[17, 0, -3]" :rotation="[0, -0.2, 0]"></primitive>
  <primitive :object="resources.get('gravestone').scene" :scale="[0.8, 0.8, 0.8]" :position="[19, 0, -6]" :rotation="[0, 0.1, 0]"></primitive>
  <primitive :object="resources.get('damagedGrave').scene" :scale="[0.8, 0.8, 0.8]" :position="[21, 0, -1]" :rotation="[0, -0.4, 0]"></primitive>
  <primitive :object="resources.get('gravestone').scene" :scale="[0.8, 0.8, 0.8]" :position="[23, 0, -4]" :rotation="[0, 0.2, 0]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[1.2, 1.2, 1.2]" :position="[27, 0, -5]" :rotation="[0, 0.5, 0]"></primitive>

  <primitive :object="resources.get('gravestone').scene" :scale="[0.8, 0.8, 0.8]" :position="[18, 0, 2]" :rotation="[0, -0.2, 0]"></primitive>
  <primitive :object="resources.get('damagedGrave').scene" :scale="[0.8, 0.8, 0.8]" :position="[20, 0, 6]" :rotation="[0, 0.3, 0]"></primitive>
  <primitive :object="resources.get('graveMarker').scene" :scale="[0.9, 0.9, 0.9]" :position="[22, 0, 3]" :rotation="[0, -0.1, 0]"></primitive>
  <primitive :object="resources.get('grave').scene" :scale="[0.8, 0.8, 0.8]" :position="[24, 0, 7]" :rotation="[0, 0.2, 0]"></primitive>
  <primitive :object="resources.get('deadTree').scene" :scale="[0.9, 0.9, 0.9]" :position="[26, 0, 4]" :rotation="[0, -0.3, 0]"></primitive>
  <primitive :object="resources.get('skull').scene" :scale="[0.6, 0.6, 0.6]" :position="[28, 0, 8]" :rotation="[0, 0.4, 0]"></primitive>

  <primitive :object="resources.get('graveMarker').scene" :scale="[0.9, 0.9, 0.9]" :position="[16, 0, 9]" :rotation="[0, -0.2, 0]"></primitive>
  <primitive :object="resources.get('gravestone').scene" :scale="[0.8, 0.8, 0.8]" :position="[15, 0, -1]" :rotation="[0, 0.1, 0]"></primitive>
  <primitive :object="resources.get('damagedGrave').scene" :scale="[0.8, 0.8, 0.8]" :position="[21, 0, 13]" :rotation="[0, -0.4, 0]"></primitive>
  <primitive :object="resources.get('graveMarker').scene" :scale="[0.9, 0.9, 0.9]" :position="[23, 0, 10]" :rotation="[0, 0.2, 0]"></primitive>
  <primitive :object="resources.get('smallDeadTree').scene" :scale="[1.0, 1.0, 1.0]" :position="[15, 0, -5]" :rotation="[0, -0.1, 0]"></primitive>
  <primitive :object="resources.get('grave').scene" :scale="[0.8, 0.8, 0.8]" :position="[27, 0, 11]" :rotation="[0, 0.3, 0]"></primitive>
  <primitive :object="resources.get('skull').scene" :scale="[0.6, 0.6, 0.6]" :position="[18, 0, 6]" :rotation="[0, -0.2, 0]"></primitive>
  <Lantern :render-light="!isMobile" :position="[26, 0, 2]" />

  <!--Front-->
  <Pumpkin :render-light="!isMobile" :position="[-11.5, 0.65, 14]" :rotation="[0, -2.9, 0]" />
  <primitive :object="resources.get('damagedGrave', 0.2).scene" :scale="[0.8, 0.8, 0.8]" :position="[-5.5, -0.35, 18]" :rotation="[0, -0.4, 0]"></primitive>
  <primitive :object="resources.get('damagedGrave', 0.2).scene" :scale="[0.7, 0.7, 0.7]" :position="[-4, -0.25, 17]" :rotation="[0, 0.5, 0]"></primitive>
  <primitive :object="resources.get('damagedGrave', 0.2).scene" :scale="[0.7, 0.7, 0.7]" :position="[2, -0.25, 18]" :rotation="[0, -0.5, 0]"></primitive>
  <primitive :object="resources.get('gravestone', 0.2).scene" :scale="[0.8, 0.8, 0.8]" :position="[7, -0.3, 16]" :rotation="[0, -0.2, 0]"></primitive>
  <primitive :object="resources.get('skull', 0.2).scene" :scale="[0.6, 0.6, 0.6]" :position="[9, 0, 18]" :rotation="[0, -0.4, 0]"></primitive>
  <primitive :object="resources.get('graveMarker', 0.2).scene" :scale="[0.9, 0.9, 0.9]" :position="[-6, 0, 16]" :rotation="[0, -0.4, 0]"></primitive>
  <primitive :object="resources.get('graveMarker', 0.2).scene" :scale="[0.9, 0.9, 0.9]" :position="[5, 0, 17]" :rotation="[0, -0.4, 0]"></primitive>


  <BattleRing />

</template>

<script setup lang="ts">
  import {useRenderLoop, useTresContext} from "@tresjs/core";
  import {onMounted} from "vue";
  import {useResources} from "@/composable/useResources";
  import Pumpkin from "@/components/objects/Pumpkin.vue";
  import BattleRing from "@/components/objects/BattleRing.vue";
  import Candles from "@/components/objects/Candles.vue";
  import Lantern from "@/components/objects/Lantern.vue";
  import PostLantern from "@/components/objects/PostLantern.vue";
  import {DocumentUtils} from "@/utils/document-utils";
  import { vLightHelper } from '@tresjs/core'
  import gsap from 'gsap';
  import {Euler, Vector3} from "three";
  import {useSounds} from "@/composable/useSounds";
  import {FireFlies} from "@/threejs-fireflies/FireFly";

  const emit = defineEmits(['finishIntro'])

  const resources = useResources();
  const sounds = useSounds();
  const { renderer, scene, camera } = useTresContext();
  const { onLoop } = useRenderLoop();
  const isMobile = true; //DocumentUtils.isMobile()

  const fireflies = new FireFlies(scene.value, {
    groupCount: 16,
    firefliesPerGroup: 17,
    groupRadius: 20,
  });

  onMounted(() => {
    listenEvents();
    camera.value.add(sounds.listener);
    camera.value?.layers.enableAll();

    setTimeout(() => {
      renderer.value.shadowMap.autoUpdate = false;
    }, 1000)
  });

  onLoop(({delta, elapsed}) => {
    fireflies.update(delta * 0.2);
  })

  const listenEvents = () => {
    document.addEventListener('visibilitychange', () => {
      renderer.value.shadowMap.needsUpdate = true;
    })
  }

  const startIntro = (duration = 3000) => {
    camera.value.position.set(-40, 20, 50);
    camera.value.rotation.set(0, -Math.PI / 4, 0);

    const finalPosition = new Vector3(0, 4, 12);
    const finalRotation = new Euler(-0.2, 0, 0);

    const timeline = gsap.timeline({
      onComplete() {
        emit('finishIntro');
      }
    });

    timeline.to(camera.value.position, {
      x: finalPosition.x,
      y: finalPosition.y,
      z: finalPosition.z,
      duration: duration / 1000,
      ease: 'power2.out',
    });

    timeline.to(camera.value.rotation, {
      x: finalRotation.x,
      y: finalRotation.y,
      z: finalRotation.z,
      duration: duration / 1000,
      ease: 'power2.out',
    }, '<');
  };

  defineExpose({
    startIntro,
  })

</script>