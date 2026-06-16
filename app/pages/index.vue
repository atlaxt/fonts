<script setup lang="ts">
const { fonts, status, error } = useFonts()
</script>

<template>
  <UPage>
    <div v-if="status === 'pending'">Yükleniyor...</div>
    <div v-else-if="error">Hata: {{ error.message }}</div>
    <pre v-else>{{ fonts }}</pre>
  </UPage>
</template>
