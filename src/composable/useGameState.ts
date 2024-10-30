import { createGlobalState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { GameStateModeEnum } from '../../enum/game-mode.enum'
import { DocumentUtils } from '@/utils/document-utils'

export const useGameState = createGlobalState(() => {
  const _isPlaying = ref(false)
  const mode = ref<GameStateModeEnum>(GameStateModeEnum.PRODUCTION)
  const isSoundsEnabled = ref(mode.value === 'PRODUCTION')
  const isFullScreen = ref(false)

  const isPlaying = computed({
    get() {
      return _isPlaying.value
    },
    set(isPlaying: boolean) {
      _isPlaying.value = isPlaying
    },
  })

  const toggleSoundState = () => {
    isSoundsEnabled.value = !isSoundsEnabled.value
  }

  const toggleFullScreenState = () => {
    !isFullScreen.value ? DocumentUtils.enterFullScreen() : DocumentUtils.exitFullScreen()
  }

  return {
    isPlaying,
    mode,
    isSoundsEnabled,
    isFullScreen,
    toggleSoundState,
    toggleFullScreenState,
  }
})
