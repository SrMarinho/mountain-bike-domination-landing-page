<template>
  <section class="">
    <HeroSection />
  </section>

  <section class="p-6 bg-gradient-to-b from-black to-gray-900 py-20">
    <CustomizeBike />
  </section>

  <section class="w-full min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 py-20">
    <TrailHighlights />
  </section>

  <section class="py-20 bg-black">
    <StatsSection />
  </section>

  <!-- CTA Section -->
  <section class="relative py-20 bg-gradient-to-t from-black to-gray-900">
    <div class="container mx-auto px-6 text-center">
      <h2
        class="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent"
      >
        GET YOUR TRAIL PASS
      </h2>
      <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        Ready to experience the ultimate downhill rush? Join thousands of riders conquering the
        mountain.
      </p>
      <button
        class="px-8 py-4 bg-gradient-to-r from-cyan-600 to-green-600 text-white font-bold text-lg rounded-lg hover:from-cyan-500 hover:to-green-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
      >
        START YOUR ADVENTURE
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
import CustomizeBike from '@/components/home/CustomizeBike.vue'
import TrailHighlights from '@/components/home/TrailHighlights.vue'
import StatsSection from '@/components/home/StatsSection.vue'
</script>

<style></style>
