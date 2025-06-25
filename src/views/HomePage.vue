<template>
  <HeroSection />
  <section class="p-6 bg-gradient-to-b from-black to-gray-900 py-20">
    <CustomizeBike />
  </section>

  <section class="p-6 bg-black-light-2">
    <TrailHighlights />
  </section>

  <section class="p-6 bg-black">
    <StatsSection />
  </section>
</template>

<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue'
import CustomizeBike from '@/components/home/CustomizeBike.vue'
import TrailHighlights from '@/components/home/TrailHighlights.vue'
import StatsSection from '@/components/home/StatsSection.vue'
</script>

<style></style>
