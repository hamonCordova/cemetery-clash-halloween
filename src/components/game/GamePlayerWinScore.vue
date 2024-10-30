<template>
  <div class="container">
    <div class="wrapper">
      <div class="content">
        <div class="logo-container">
          <img
            class="logo-img"
            src="/img/cemetery-clash-halloween-logo.webp"
            alt="Cemetery Clash: Halloween logo"
            width="1024"
            height="828"
          />
        </div>
        <h1 class="title">
          Champion of the Night!
          <br />
          The battle is over.
        </h1>
        <p class="description">
          Thank you for playing! Though you've won, the darkness endures. Start a new game and face
          it again.
        </p>
        <ul>
          <li>
            <button @click="emit('restart')">New Game</button>
          </li>
        </ul>
      </div>
      <footer>
        <div class="footer-container">
          Developed by
          <a href="https://www.linkedin.com/in/hamoncordova/" target="_blank">Hamon Córdova</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['restart'])
</script>

<style scoped>
  .container {
    width: 100vw;
    height: 100%;
    position: fixed;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.9) 1%, transparent 100%);
  }

  .wrapper {
    width: 100%;
    height: 100%;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .title {
    font-size: 50px;
    line-height: 50px;
    text-align: center;
    color: #ee5e0a;
    font-family: 'Metal Mania', system-ui;
    -webkit-text-stroke: 1px #000;
    font-weight: bold;
    background: #ee5e0a;
    background: linear-gradient(to right, #ee5e0a 12%, #d31616 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0;
  }

  .description {
    font-size: 18px;
    color: #808080;
    text-align: center;
    margin-bottom: 0;
  }

  .logo-container {
    width: 300px;
    max-width: 100%;
  }

  .logo-img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  ul {
    list-style: none;
    width: 100%;
  }

  li {
    width: 100%;
  }

  footer {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex-grow: 1;
    width: 100%;
  }

  .footer-container {
    border-top: 1px solid #808080;
    padding-top: 15px;
    width: 100%;
    color: #fff;
    text-align: center;
  }

  a {
    color: #ee5e0a;
  }

  @media only screen and (min-width: 768px) {
    .container {
      width: 600px;
    }
  }

  @media only screen and (min-width: 1328px) {
    .container {
      width: 600px;
    }

    .logo-container {
      width: 400px;
    }

    .title {
      font-size: 60px;
    }
  }
</style>
