<!-- eslint-disable prefer-const -->
<template>
  <div class="container mx-auto px-6">
    <!-- Title -->
    <div class="text-center my-16">
      <h2
        class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400 mb-6"
      >
        TRAIL HIGHLIGHTS
      </h2>
      <p class="text-xl text-gray-300 max-w-3xl mx-auto">
        Discover our most epic trails, each offering unique challenges and breathtaking scenery
      </p>
    </div>
  </div>
  <!-- Trails -->
  <div>
    <!-- Trail filter -->
    <div class="w-fit p-2 bg-black-light rounded-md font-bold">
      <button
        class="px-6 py-3 bg-white rounded-md duration-200"
        @click="() => (trailFilterSelected = null)"
      >
        All Trails
      </button>
      <button
        class="px-6 py-3 bg-green-400 hover:bg-green-400/40 rounded-md duration-200"
        @click="() => (trailFilterSelected = TrailDifficulty.Beginner)"
      >
        Beginner
      </button>
      <button
        class="duration-200"
        @click="() => (trailFilterSelected = TrailDifficulty.Intermediate)"
      >
        Intermediate
      </button>
      <button class="duration-200" @click="() => (trailFilterSelected = TrailDifficulty.Expert)">
        Expert
      </button>
    </div>
    <div>
      <div v-for="(trail, index) in trailFiltered" :key="index" class="">
        <div class="w-full h-1/3 bg-black"></div>
        <b class="w-full">{{ trail.title }}</b>
        <p class="w-full">{{ trail.description }}</p>
        <div>
          <span>{{ trail.total_distance }} km</span>
          <span>{{ trail.descent }}m descent</span>
        </div>
        <hr />
        <button>Explore Trail</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

enum TrailDifficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Expert = 'Expert',
}

class TrailCard {
  constructor(
    public title: string,
    public description: string,
    public total_distance: number,
    public descent: number,
    public difficult: TrailDifficulty,
  ) {}
}

const trailsList: TrailCard[] = [
  new TrailCard(
    "Beginner's Luck",
    'Perfect starter trail with gentle slopes and scenic views',
    3.2,
    150,
    TrailDifficulty.Beginner,
  ),

  new TrailCard(
    'Forest Flow',
    'Smooth singletrack through dense pine forest',
    4.1,
    200,
    TrailDifficulty.Beginner,
  ),

  new TrailCard(
    'Adrenaline Rush',
    'Technical features with jumps and bermed corners',
    5.8,
    380,
    TrailDifficulty.Intermediate,
  ),

  new TrailCard(
    'Ridge Runner',
    'Exposed ridgeline with breathtaking mountain views',
    6.5,
    450,
    TrailDifficulty.Intermediate,
  ),

  new TrailCard(
    'Death Wish',
    'Extreme terrain with rock gardens and steep drops',
    4.2,
    520,
    TrailDifficulty.Expert,
  ),

  new TrailCard(
    'The Gauntlet',
    'Technical alpine descent for experienced riders only',
    7.1,
    680,
    TrailDifficulty.Expert,
  ),
]

const trailFilterSelected = ref<TrailDifficulty | null>(null)

const trailFiltered = computed(() => {
  if (!trailFilterSelected.value) return trailsList
  return trailsList.filter((trail) => trail.difficult === trailFilterSelected.value)
})
</script>

<style scoped></style>
