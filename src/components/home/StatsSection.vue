<template>
  <div class="container mx-auto px-12">
    <!-- Title -->
    <div ref="sectionTitle" class="text-center mb-16">
      <h2
        class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400 mb-6"
      >
        BY THE NUMBERS
      </h2>
      <p class="text-xl text-gray-300 max-w-3xl mx-auto">
        The ultimate destination for downhill mountain biking enthusiasts worldwide
      </p>
    </div>
    <div ref="statsGrid" class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
          {{ stat.display }}
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
import { ref, onMounted } from 'vue'
import {
  ArrowTrendingUpIcon,
  MapPinIcon,
  RocketLaunchIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionTitle = ref<HTMLElement | null>(null)
const statsGrid = ref<HTMLElement | null>(null)

const stats = ref([
  { image: MapPinIcon,         target: 50,   suffix: '+',  display: '0',    label: 'Epic Trails',    description: 'From beginner-friendly to expert-only death drops' },
  { image: UsersIcon,          target: 10,   suffix: 'K+', display: '0',    label: 'Active Riders',  description: 'Join the growing community of downhill enthusiasts' },
  { image: ArrowTrendingUpIcon,target: 2000, suffix: 'm',  display: '0',    label: 'Max Vertical',   description: 'Experience the ultimate gravity-fed adrenaline rush' },
  { image: RocketLaunchIcon,   target: 25,   suffix: '+',  display: '0',    label: 'Pro Events',     description: 'Host to world-class downhill competitions' },
])

onMounted(() => {
  gsap.fromTo(
    sectionTitle.value,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: sectionTitle.value, start: 'top 85%' } },
  )

  ScrollTrigger.create({
    trigger: statsGrid.value,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      stats.value.forEach((stat) => {
        const counter = { val: 0 }
        gsap.to(counter, {
          val: stat.target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            stat.display = Math.round(counter.val) + stat.suffix
          },
        })
      })

      gsap.fromTo(
        statsGrid.value!.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.15 },
      )
    },
  })
})
</script>
<style scoped></style>
