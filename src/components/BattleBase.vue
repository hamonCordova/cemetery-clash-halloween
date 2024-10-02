<script setup lang="ts">
  import {useTresContext} from "@tresjs/core";
  import {onMounted} from "vue";
  import {FogExp2} from "three";

  const { scene } = useTresContext()

  onMounted(() => {
    scene.value.fog = new FogExp2('rgb(255,91,6)', 0.02);
  })
</script>