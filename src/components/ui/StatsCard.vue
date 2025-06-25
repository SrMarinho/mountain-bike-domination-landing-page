<template>
  <div></div>
</template>
<script setup lang="ts">
import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue'

defineProps<{
  stats: {
    image: FunctionalComponent<HTMLAttributes & VNodeProps>
    value: string
    title: string
    subtitle: string
  }
}>()
</script>
<style scoped></style>
