<!-- eslint-disable prefer-const -->
<template>
  <div class="container mx-auto px-6">
    <!-- Title -->
    <div class="text-center my-14">
      <h2
        class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400 mb-6"
      >
        TRAIL HIGHLIGHTS
      </h2>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto">
        Discover our most epic trails, each offering unique challenges and breathtaking scenery
      </p>
    </div>
  </div>
  <!-- Trails -->
  <div class="w-full gap-12 flex flex-col justify-center items-center">
    <!-- Trail filter -->
    <div class="w-fit py-2 px-2 bg-black-light rounded-lg font-medium">
      <button
        class="px-6 py-3 hover:bg-white/10 hover:text-white rounded-md duration-200"
        :class="!trailFilterSelected ? 'text-black bg-white' : 'text-white'"
        @click="() => (trailFilterSelected = null)"
      >
        All Trails
      </button>
      <button
        class="px-6 py-3 hover:bg-green-400/10 hover:text-green-400 rounded-md duration-200"
        :class="
          trailFilterSelected == TrailDifficulty.Beginner
            ? 'text-black bg-green-400'
            : 'text-green-400'
        "
        @click="setTrailFilter(TrailDifficulty.Beginner)"
      >
        Beginner
      </button>
      <button
        class="px-6 py-3 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-md duration-200"
        :class="
          trailFilterSelected == TrailDifficulty.Intermediate
            ? 'text-black bg-yellow-400'
            : 'text-yellow-400'
        "
        @click="setTrailFilter(TrailDifficulty.Intermediate)"
      >
        Intermediate
      </button>
      <button
        class="px-6 py-3 hover:text-red-400 hover:bg-red-400/10 rounded-md duration-200"
        :class="
          trailFilterSelected == TrailDifficulty.Expert ? 'text-black bg-red-400' : 'text-red-400'
        "
        @click="setTrailFilter(TrailDifficulty.Expert)"
      >
        Expert
      </button>
    </div>
    <div class="relative transition-all duration-500">
      <TransitionGroup
        name="fade"
        tag="div"
        class="gap-8 grid md:grid-cols-2 lg:grid-cols-3 justify-center items-center"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform opacity-0 translate-y-4"
        leave-active-class="transition duration-200 ease-in absolute"
        leave-to-class="transform opacity-0 -translate-y-4"
      >
        <TrailCard v-for="(trail, index) in trailFiltered" :key="trail.id" :trail="trail" />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Trail } from '@/types/Trail'
import { TrailDifficulty } from '@/types/trail_difficulty'
import TrailCard from '../ui/TrailCard.vue'

const trailsList: Trail[] = [
  {
    id: 0,
    image: '/trail/1.jpg',
    title: "Beginner's Luck",
    description: 'Perfect starter trail with gentle slopes and scenic views',
    total_distance: 3.2,
    descent: 150,
    difficulty: TrailDifficulty.Beginner,
  },

  {
    id: 1,
    image: '/trail/2.jpg',
    title: 'Forest Flow',
    description: 'Smooth singletrack through dense pine forest',
    total_distance: 4.1,
    descent: 200,
    difficulty: TrailDifficulty.Beginner,
  },

  {
    id: 2,
    image: '/trail/3.jpg',
    title: 'Adrenaline Rush',
    description: 'Technical features with jumps and bermed corners',
    total_distance: 5.8,
    descent: 380,
    difficulty: TrailDifficulty.Intermediate,
  },

  {
    id: 3,
    image: '/trail/4.jpg',
    title: 'Ridge Runner',
    description: 'Exposed ridgeline with breathtaking mountain views',
    total_distance: 6.5,
    descent: 450,
    difficulty: TrailDifficulty.Intermediate,
  },

  {
    id: 4,
    image: '/trail/5.jpg',
    title: 'Death Wish',
    description: 'Extreme terrain with rock gardens and steep drops',
    total_distance: 4.2,
    descent: 520,
    difficulty: TrailDifficulty.Expert,
  },

  {
    id: 5,
    image: '/trail/6.jpg',
    title: 'The Gauntlet',
    description: 'Technical alpine descent for experienced riders only',
    total_distance: 7.1,
    descent: 680,
    difficulty: TrailDifficulty.Expert,
  },
]

const trailFilterSelected = ref<TrailDifficulty | null>(null)

const trailFiltered = computed(() => {
  if (!trailFilterSelected.value) return trailsList
  return trailsList.filter((trail) => trail.difficulty === trailFilterSelected.value)
})

function setTrailFilter(difficulty: TrailDifficulty) {
  trailFilterSelected.value = difficulty
}
</script>

<style scoped></style>
