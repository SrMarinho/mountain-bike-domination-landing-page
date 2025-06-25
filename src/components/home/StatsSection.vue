<template>
  <div class="container mx-auto px-6">
    <!-- Title -->
    <div class="text-center my-14">
      <h2
        class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400 mb-6"
      >
        BY THE NUMBERS
      </h2>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto">
        The ultimate destination for downhill mountain biking enthusiasts worldwide
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ArrowTrendingUpIcon,
  MapPinIcon,
  RocketLaunchIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import StatsCard from '../ui/StatsCard.vue'

const stats = [
  {
    image: MapPinIcon,
    number: '50+',
    label: 'Epic Trails',
    description: 'From beginner-friendly to expert-only death drops',
  },
  {
    image: UsersIcon,
    number: '10K+',
    label: 'Active Riders',
    description: 'Join the growing community of downhill enthusiasts',
  },
  {
    image: ArrowTrendingUpIcon,
    number: '2000m',
    label: 'Max Vertical',
    description: 'Experience the ultimate gravity-fed adrenaline rush',
  },
  {
    image: RocketLaunchIcon,
    number: '25+',
    label: 'Pro Events',
    description: 'Host to world-class downhill competitions',
  },
]
</script>
<style scoped></style>
