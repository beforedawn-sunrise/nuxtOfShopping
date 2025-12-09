<script setup lang="ts">
import Header from '../components/Header.vue';
import LoginModal from '../components/LoginModal.vue';
</script>

<template>
  <div>
    <Header></Header>
    <LoginModal/>
    <slot />
  </div>
</template>

