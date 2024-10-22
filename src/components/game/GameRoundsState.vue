<template>
  <div class="container" v-if="isVisible && gameState.isPlaying.value">
    <h1 :class="['round']" ref="roundRef">
      {{isFinalRound ? 'Final Round' : 'Round ' + currentRound}}
    </h1>
    <h2 :class="['round-stage']" ref="roundStageRef">Stage {{currentStage}}</h2>
  </div>
</template>

<script setup lang="ts">
  import {useEventBus} from "@vueuse/core";
  import {computed, nextTick, onMounted, ref} from "vue";
  import {useGameState} from "@/composable/useGameState";
  import gsap from "gsap";
  import {useSounds} from "@/composable/useSounds";
  import {DocumentUtils} from "@/utils/document-utils";

  const battleManagerEventBus =  useEventBus('battleManager');
  const gameState = useGameState();
  const isVisible = ref(false);
  const currentRound = ref(0);
  const currentStage = ref(0);
  const isMobile = DocumentUtils.isMobile();
  const sounds = useSounds();
  const roundSounds = {
    round1: sounds.getAudio('round1'),
    round2: sounds.getAudio('round2'),
    round3: sounds.getAudio('round3'),
    finalRound: sounds.getAudio('finalRound'),
  }

  const roundRef = ref();
  const roundStageRef = ref();

  const isFinalRound = computed(() => {
    return currentRound.value === 4;
  })

  onMounted(() => {
    listenToEvents();
  })

  const listenToEvents = () => {

    battleManagerEventBus.on((event, payload) => {

      if (event === 'battleEnd') {
        isVisible.value = false;
      }

      if (event === 'roundChange') {
        const {roundNum} = payload;
        isVisible.value = true;
        currentRound.value = roundNum;

        nextTick(() => {

          const gsapTimeline = gsap.timeline({});

          gsap.set(roundRef.value, {
            fontSize: '25px',
            left: '10px',
            top: '70px',
            transform: 'unset',
          });

          gsapTimeline.to(roundRef.value, {
            fontSize: isMobile ? '60px' : '80px',
            left: isMobile ? 'calc(50% - 90px)' : 'calc(50% - 130px)',
            top: '20%',
            ease: 'power2.in',
            duration:  0.7,
            onComplete() {

              if (!gameState.isSoundsEnabled.value) return

              if (!isFinalRound.value) {
                roundSounds[`round${currentRound.value}`]?.play();
                return;
              }

              roundSounds.finalRound.play();
            }
          })


          gsapTimeline.to(roundRef.value, {
            fontSize: '25px',
            left: '10px',
            top: isMobile ? '60px' : '65px',
            ease: 'power2.out',
            duration:  0.6,
            delay: 2
          })
        })

      }

      if (event === 'stageChange') {
        currentStage.value = payload.stageNum;
      }
    })

  }

</script>

<style scoped>

  .container {
    position: fixed;
    top: 40px;
    left: 10px;
    user-select: none;
  }

  .round {
    font-size: 25px;
    left: 10px;
    top: 40px;
    position: fixed;
    color: #ee5e0a;
    font-family: "Metal Mania", system-ui;
    -webkit-text-stroke: 1px #000;
    font-weight: bold;
    background: #EE5E0A;
    background: linear-gradient(to right, #EE5E0A 12%, #D31616 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .round-stage {
    position: fixed;
    top: 97px;
    color: #fff;
    font-weight: normal;
    font-size: 14px;
  }

  @media only screen and (min-width: 768px) {
    .container {
      top: 60px;
    }
  }

</style>