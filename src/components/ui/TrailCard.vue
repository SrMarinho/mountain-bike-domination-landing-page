<template>
  <div
    class="group h-full grow bg-gray-400/40 rounded-xl text-white overflow-hidden backdrop-blur-sm transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/25"
    :class="{
      'bg-green-400/10': trail.difficulty === TrailDifficulty.Beginner,
      'bg-yellow-400/10': trail.difficulty === TrailDifficulty.Intermediate,
      'bg-red-400/10': trail.difficulty === TrailDifficulty.Expert,
    }"
  >
    <div class="w-full h-48 bg-black overflow-clip">
      <img
        class="w-full h-48 object-cover transition-transform duration-900 group-hover:scale-115"
        :src="trail.image"
        alt="Trail image example"
      />
    </div>
    <div class="p-8 flex flex-col justify-around gap-4">
      <h3 class="w-full font-bold text-2xl">{{ trail.title }}</h3>
      <p class="w-full text-gray-300">{{ trail.description }}</p>
      <div class="flex gap-2 text-sm text-gray-400">
        <span>📏 {{ trail.total_distance }} km</span>
        <span>📉 {{ trail.descent }}m descent</span>
      </div>
      <hr class="border-gray-400" />
      <button
        class="w-full px-4 py-2 font-bold bg-gradient-to-r from-cyan-600 hover:to-green-500 hover:from-cyan-500 to-green-600 rounded-lg"
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
