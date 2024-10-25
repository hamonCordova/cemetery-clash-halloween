<template>
  <div class="container">
    <div class="wrapper">
    <div class="keys-action-group">
      <div class="wasd-keys">
        <span class="key key-w">W</span>
        <span class="key key-a">A</span>
        <span class="key key-s">S</span>
        <span class="key key-d">D</span>
      </div>
      <p class="keys-action-description">Movement</p>
    </div>
    <div class="plus-sign">+</div>
    <div class="keys-action-group">
      <span class="key key-shift">Shift</span>
      <p class="keys-action-description">Run</p>
    </div>
    <div class="divider"></div>
    <div class="keys-action-group">
      <span class="key key-space">Space</span>
      <p class="keys-action-description">Jump</p>
    </div>
    <div class="divider"></div>
    <div class="keys-action-group">
      <svg class="key-img key-click" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233" id="mouse-click">
        <g transform="translate(73.405 -1.965)">
          <g>
            <g>
              <g>
                <g>
                  <g>
                    <g>
                      <g>
                        <g>
                          <g>
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width=".2" d="m -72.124033,3.4611224 0.614674,2.1961432 c 0.05587,0.1479683 0.222639,0.1699676 0.314085,0.078522 l 0.61989,-0.6198892 0.606699,0.6066998 c 0.229917,0.2299163 0.547386,-0.097963 0.322673,-0.3226737 l -0.606699,-0.6066997 0.629705,-0.6297041 c 0.09144,-0.091445 0.06944,-0.2582234 -0.07853,-0.3140851 l -2.196139,-0.6146752 c -0.143513,-0.038455 -0.266925,0.074982 -0.226362,0.2263622 z" paint-order="markers fill stroke"></path>
                            <path fill="#f2f2f2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width=".2" d="M-73.008829 2.3604471l.396879.3979085M-71.484303 2.3622255l-.255795.2551268m-.943821.9413537l-.325266.3244156" paint-order="markers fill stroke"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <p class="keys-action-description">Attack</p>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeUnmount, onMounted } from "vue";

  let keydownListener: (event: KeyboardEvent) => void;
  let keyupListener: (event: KeyboardEvent) => void;
  let mousedownListener: () => void;
  let mouseupListener: () => void;

  const listenToEvents = () => {
    keydownListener = (event) => {
      const key = event.key === ' ' ? document.querySelector('.key-space') : document.querySelector(`.key-${event.key.toLowerCase()}`);
      if (key) key.classList.add('key-pressed');
    };

    keyupListener = (event) => {
      const key = event.key === ' ' ? document.querySelector('.key-space') : document.querySelector(`.key-${event.key.toLowerCase()}`);
      if (key) key.classList.remove('key-pressed');
    };

    mousedownListener = () => {
      const clickKey = document.querySelector('.key-click');
      if (clickKey) clickKey.classList.add('key-pressed');
    };

    mouseupListener = () => {
      const clickKey = document.querySelector('.key-click');
      if (clickKey) clickKey.classList.remove('key-pressed');
    };

    document.addEventListener('keydown', keydownListener);
    document.addEventListener('keyup', keyupListener);
    window.addEventListener('mousedown', mousedownListener);
    window.addEventListener('mouseup', mouseupListener);
  };

  const stopListenToEvents = () => {
    document.removeEventListener('keydown', keydownListener);
    document.removeEventListener('keyup', keyupListener);
    window.removeEventListener('mousedown', mousedownListener);
    window.removeEventListener('mouseup', mouseupListener);
  };

  onMounted(() => {
    listenToEvents();
  });

  onBeforeUnmount(() => {
    stopListenToEvents();
  });

</script>

<style scoped>

.container {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 5vh;
  user-select: none;
}

.wrapper {
  width: 900px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 40px;
  max-width: 95vw;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
}

.wasd-keys {
  display: grid;
  gap: 5px;
  grid-template-areas: ". w ."
                       "a s d";
}

.key {
  display: flex;
  width: 25px;
  height: 25px;
  text-transform: uppercase;
  justify-content: center;
  align-items: center;
  border: 1px solid #fff;
  padding: 5px;
  border-radius: 5px;
  color: #fff;
  transition: background ease-out 120ms,
  color ease-out 120ms,
  border-color ease-out 120ms
}

.key-img {
  color: #fff;
  width: 45px;
  height: 45px;
  stroke-width: 1px;
  transition: color ease-out 120ms;
}

.key-img path[fill="none"], .key-img path[fill="#FF7112"]  {
  transition: fill ease-out 120ms;
}

.key-pressed:not(.key-img) {
  background: #FF7112;
  color: #fff;
  border: 1px solid #D4560B;
}

.key-pressed.key-img {
  color: #FF7112;
}

.key-pressed.key-img path[fill="none"] {
  fill: #FF7112;
}

.keys-action-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.keys-action-description {
  font-size: 20px;
  margin: 0;
  color: #fff;
}

.key-w {
  grid-area: w;
}

.key-a {
  grid-area: a;
}

.key-s {
  grid-area: s;
}

.key-d {
  grid-area: d;
}

.key-shift {
  width: 70px;
}

.key-space {
  width: 180px;
}

.plus-sign {
  color: #fff;
  font-size: 35px;
  align-self: center;
}

.divider {
  height: 30px;
  width: 1px;
  background: #fff;
  align-self: center;
}
</style>