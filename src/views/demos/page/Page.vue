<template>
  <mag-button type="primary" @click="openPage">打开页面</mag-button>
</template>

<script setup lang="ts">
import router from "@/router";

const openPage = () => {
  router.push("/layout/subpage");
}
</script>

<style scoped lang="scss">
</style>