<template>
  <div class="container">
    <div class="wrapper">
      <ul class="list">
        <li class="item">
          <div class="item-img-container">
            <img src="/img/controls/click.png" alt="Mouse click" class="item-img" width="512" height="512">
          </div>
          <p class="item-description">Attack</p>
        </li>
        <li class="item">
          <div class="item-img-container">
            <img src="/img/controls/wasd.png" alt="WASD keys" class="item-img" width="512" height="512">
          </div>
          <p class="item-description">Movement</p>
        </li>
        <li class="item">
          <div class="item-img-container">
            <img src="/img/controls/shift.png" alt="Shift key" class="item-img" width="512" height="512">
          </div>
          <p class="item-description">Run</p>
        </li>
        <li class="item">
          <div class="item-img-container">
            <img src="/img/controls/space.png" alt="Space key" class="item-img" width="512" height="512">
          </div>
          <p class="item-description">Jump</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {onMounted} from "vue";

  const emit = defineEmits(['finish'])

  onMounted(() => {
    setTimeout(() => {
      emit('finish')
    }, 4000)
  })
</script>

<style scoped>
  .container {
    height: 120px;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 5vh;
    user-select: none;
  }

  .wrapper {
    width: 60%;
    min-width: 700px;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .list {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 0;
  }

  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    gap: 10px;
  }

  .item:not(:last-child):before {
    content: "";
    right: 0;
    width: 1px;
    height: 50px;
    position: absolute;
    top: 20%;
    background: rgba(54, 54, 54, 0.4);
  }

  .item-img-container {
    width: 60px;
  }

  .item-img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  .item-description {
    color: #fff;
    font-weight: normal;
    font-size: 19px;
    margin: 0;
  }

</style>