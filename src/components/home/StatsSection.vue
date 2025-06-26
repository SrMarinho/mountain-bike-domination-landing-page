<template>
  <div class="container mx-auto px-12">
    <!-- Title -->
    <div class="text-center mb-16">
      <h2
        class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400 mb-6"
      >
        BY THE NUMBERS
      </h2>
      <p class="text-xl text-gray-300 max-w-3xl mx-auto">
        The ultimate destination for downhill mountain biking enthusiasts worldwide
      </p>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="text-white flex flex-col justify-center items-center gap-4 group"
      >
        <component
          :is="stat.image"
          class="w-16 h-16 p-3 group-hover:scale-110 duration-300 rounded-full bg-gradient-to-r from-cyan-600 to-green-600"
        />
        <div
          class="text-4xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300"
        >
          {{ stat.number }}
        </div>
        <h3 class="text-xl font-semibold text-gray-300 mb-2">{{ stat.label }}</h3>
        <p class="text-gray-400 text-sm leading-relaxed">{{ stat.description }}</p>
      </div>
    </div>
    <div class="mt-16 grid grid-cols-3 gap-8 text-center opacity-50">
      <div class="text-cyan-400">
        <div class="text-2xl font-bold">EST. 2018</div>
        <div class="text-sm text-gray-500">Mountain Domination</div>
      </div>
      <div class="text-green-400">
        <div class="text-2xl font-bold">24/7</div>
        <div class="text-sm text-gray-500">Trail Access</div>
      </div>
      <div class="text-orange-400">
        <div class="text-2xl font-bold">0 LIMITS</div>
        <div class="text-sm text-gray-500">Pure Adrenaline</div>
      </div>
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
