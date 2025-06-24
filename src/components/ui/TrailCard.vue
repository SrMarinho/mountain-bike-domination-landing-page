<template>
  <div
    class="h-full grow bg-black/40 rounded-xl text-white overflow-hidden backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/25"
  >
    <img
      class="w-full h-48 bg-black object-cover transition-transform duration-700 group-hover:scale-110"
      :src="trail.image"
      alt="Trail image example"
    />
    <div class="p-8 flex flex-col justify-around gap-6">
      <h3 class="w-full font-bold text-2xl">{{ trail.title }}</h3>
      <p class="w-full">{{ trail.description }}</p>
      <div class="flex gap-2 text-sm text-gray-400">
        <span>📏 {{ trail.total_distance }} km</span>
        <span>📉 {{ trail.descent }}m descent</span>
      </div>
      <hr />
      <button
        class="w-full px-4 py-2 font-bold bg-gradient-to-r from-cyan-600 to-green-600 rounded-lg"
      >
        Explore Trail
      </button>
    </div>
    <span
      class="absolute outline-1 outline-solid py-1 px-2 rounded-full top-4 right-4 backdrop-blur-md font-medium text-sm"
      :class="{
        'outline-green-400 text-green-400': trail.difficulty === TrailDifficulty.Beginner,
        'outline-yellow-400 text-yellow-400': trail.difficulty === TrailDifficulty.Intermediate,
        'outline-red-400 text-red-400': trail.difficulty === TrailDifficulty.Expert,
      }"
      >{{ trail.difficulty.toUpperCase() }}</span
    >
  </div>
</template>
<script setup lang="ts">
import type { Trail } from '@/types/Trail'
import { TrailDifficulty } from '@/types/trail_difficulty'

defineProps<{
  trail: Trail
}>()
</script>
<style></style>
