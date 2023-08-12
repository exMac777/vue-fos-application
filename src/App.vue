<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store  = useStore();

const response = computed(() => {
  return store.getters.primaryMenu;
})

onMounted(() => {
  store.commit('getPrimaryMenu');
}),
</script>

<template>
  <div>
    <pre>{{ response }}</pre>
  </div>
</template>

<style scoped></style>
