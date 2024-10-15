import {Audio} from "three/src/audio/Audio";
import type {PositionalAudio} from "three";

export default class GameAudioPlayer {
    private lastPlayedTime: number = 0;
    private cooldown: number = 0;

    constructor(
        public audios: Audio[] | PositionalAudio[],
    ) {}

    public playRandom() {
        const now = Date.now();

        if (now - this.lastPlayedTime < this.cooldown) {
            return;
        }

        const audio = this.audios[Math.floor(Math.random() * this.audios.length)];
        if (!audio || audio.isPlaying) return;

        audio.play();
        this.lastPlayedTime = now;
    }

    public setCooldown(cooldown: number) {
        this.cooldown = cooldown;
    }
}
