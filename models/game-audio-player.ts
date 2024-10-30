import { Audio } from 'three/src/audio/Audio'
import { PositionalAudio } from 'three'
import { useGameState } from '@/composable/useGameState'

export default class GameAudioPlayer {
  private lastPlayedTime: number = 0
  private cooldown: number = 0
  private gameState = useGameState()

  constructor(public audios: Audio[] | PositionalAudio[]) {}

  public playRandom() {
    if (!this.gameState.isSoundsEnabled.value) return

    const now = Date.now()

    if (now - this.lastPlayedTime < this.cooldown) {
      return
    }

    const audio = this.audios[Math.floor(Math.random() * this.audios.length)]
    if (!audio || audio.isPlaying) return

    try {
      audio.play()
    } catch (e) {
      console.error('Error playing audio', e)
    }
    this.lastPlayedTime = now
  }

  public setCooldown(cooldown: number) {
    this.cooldown = cooldown
  }

  public stopAll() {
    this.audios.forEach((audio) => audio.stop())
  }

  public static stopAllAudioPlayers(players: { [key: string]: GameAudioPlayer }) {
    if (!players) return

    Object.keys(players).forEach((key) => {
      const player = players[key]
      player.audios.forEach((audio) => {
        audio.stop()
      })
    })
  }
}
