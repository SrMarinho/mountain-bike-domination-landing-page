<template>
  <div class="container mx-auto px-6">
    <!-- Title -->
    <div class="text-center mb-16">
      <h2
        class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400 mb-6"
      >
        BIKE CUSTOMIZER
      </h2>
      <p class="text-xl text-gray-300 max-w-3xl mx-auto">
        Build your perfect downhill machine. Every component engineered for maximum performance and
        reability
      </p>
    </div>
    <!-- Content -->
    <div
      class="container mx-auto lg:max-w-7xl text-white grid lg:grid-cols-2 gap-8 justify-center items-center"
    >
      <div class="flex flex-col gap-6">
        <!-- Components -->
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="(component, index) in components"
            :key="index"
            class="flex flex-col justify-around gap-2 rounded-xl bg-black-light-2/50 p-6 outline-gray-600 outline-2 outline-solid duration-300 hover:outline-gray-300"
            :class="{
              'bg-primary/15 outline-primary text-primary ': currentComponent == index,
            }"
            @click="() => (currentComponent = index)"
          >
            <p class="text-xl font-bold">{{ component.title }}</p>
            <p class="text-sm">{{ component.description }}</p>
          </div>
        </div>
        <!--  Selected component specs -->
        <div
          class="rounded-xl bg-black-light-2/50 p-6 border-solid border-gray-600 border-1 flex flex-col gap-2 mb-4"
        >
          <p class="text-2xl font-bold text-primary mb-2">
            {{ `${components[currentComponent].title} Specs` }}
          </p>
          <div
            class="flex items-center gap-4"
            v-for="(spec, index) in components[currentComponent].specs"
            :key="index"
          >
            <img class="w-2 h-2 rounded-full bg-green-400" />
            <p>{{ spec }}</p>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div
        class="h-fit rounded-xl bg-black-light-2/50 p-8 border-solid border-gray-600 border-1 flex flex-col justify-center items-center"
      >
        <h3 class="font-bold text-2xl pb-6">Performance Metrics</h3>
        <div class="w-full flex flex-col gap-4 text-gray-300">
          <div class="w-full flex justify-between">
            <span>Weight</span>
            <span class="text-primary font-bold">16.2 kg</span>
          </div>

          <div class="w-full flex justify-between">
            <span>Travel</span>
            <span class="text-green-400 font-bold">200mm / 200mm</span>
          </div>

          <div class="w-full flex justify-between">
            <span>Max Speed</span>
            <span class="text-orange-400 font-bold">80+ km/h</span>
          </div>

          <div class="w-full h-2 rounded-xl bg-gray-600">
            <div
              class="h-2 rounded-xl bg-gradient-to-r from-primary to-green-400"
              :class="[`w-[calc(100%_*_${performanceRating})]`]"
            ></div>
          </div>

          <p class="w-full text-center text-gray-400 text-sm">
            Performance Rating: {{ (performanceRating * 10).toFixed(1) }}/10
          </p>
        </div>
        <button
          class="w-full rounded-xl py-3 px-6 mt-6 font-bold bg-gradient-to-r from-cyan-600 to-green-600 hover:scale-105 hover:from-primary hover:to-green-400 duration-200 transition-all"
        >
          BUILD THIS SETUP
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'

class Component {
  constructor(
    public title: string,
    public description: string,
    public specs: Array<string>,
  ) {}
}

const performanceRating: Ref = ref(0.92)

const components: Array<Component> = [
  new Component('Suspension', 'Premium air-sprung fork with 200mm travel', [
    '200mm Travel',
    'Air Spring',
    'Rebound Adjust',
    'Compression Damping',
  ]),

  new Component('Brakes', '4-piston hydraulic disc brakes with 203mm rotors', [
    '4-Piston Calipers',
    '203mm Rotors',
    'Hydraulic Lines',
    'Heat Dissipation',
  ]),

  new Component('Drivetrain', '12-speed electronic shifting system', [
    '12-Speed Cassette',
    'Electronic Shifting',
    'Chain Guide',
    'Bash Guard',
  ]),

  new Component('Wheels', 'Carbon fiber rims with tubeless-ready tires', [
    'Carbon Fiber Rims',
    'Tubeless Ready',
    '2.5" Tires',
    'DH Rated',
  ]),
]

// eslint-disable-next-line prefer-const
let currentComponent: Ref = ref(0)
</script>

<style scoped></style>
