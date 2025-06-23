<template>
  <div
    class="w-full p-6 flex flex-col justify-center items-center bg-gradient-to-b from-black to-black-light pt-22"
  >
    <div class="text-center mb-17">
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
    <div class="w-full max-w-7xl text-white flex flex-wrap gap-7 justify-center items-center">
      <div class="min-w-md flex-1 flex flex-col gap-8">
        <div class="w-full grid grid-cols-2 grid-rows-2 gap-4">
          <div
            v-for="(component, index) in components"
            :key="index"
            class="w-full flex flex-col gap-3 rounded-xl bg-black-light-2/50 p-6 outline-gray-600 outline-2 outline-solid duration-300 hover:outline-gray-300"
            :class="{
              'bg-primary/15 outline-primary text-primary ': currentComponent == index,
            }"
            @click="() => (currentComponent = index)"
          >
            <p class="text-xl font-bold">{{ component.title }}</p>
            <p class="text-sm">{{ component.description }}</p>
          </div>
        </div>
        <div
          class="w-full rounded-xl bg-black-light-2/50 p-6 border-solid border-gray-600 border-1 flex flex-col gap-2 mb-4"
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
      <div
        class="w-full min-w-md h-fit rounded-xl bg-black-light-2/50 p-6 border-solid border-gray-600 border-1 flex flex-col gap-6 flex-1"
      >
        <p class="font-bold text-2xl">Performance Metrics</p>
        <div class="flex flex-col gap-6 text-gray-300">
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
        </div>
        <div class="w-full h-2 rounded-xl bg-gray-600">
          <div class="w-9/12 h-2 rounded-xl bg-gradient-to-r from-primary to-green-400"></div>
        </div>
        <p class="w-full text-center text-gray-400 text-sm">Performance Rating: 9.2/10</p>
        <button
          class="w-full rounded-xl py-2.5 font-bold bg-gradient-to-r from-cyan-600 to-green-600"
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
const components: Array<Component> = [
  new Component('Suspension', 'Premium air-sprung fork with 200mm travel', [
    '200mm Travel',
    'Air Spring',
    'Rebound Adjust',
    'Compression Damping',
  ]),

  new Component('Brakes', 'Premium air-sprung fork with 200mm travel', [
    '4-Piston Calipers',
    '203mm Rotors',
    'Hydraulic Lines',
    'Heat Dissipation',
  ]),

  new Component('Drivetrain', 'Premium air-sprung fork with 200mm travel', [
    '12-Speed Cassette',
    'Electronic Shifting',
    'Chain Guide',
    'Bash Guard',
  ]),

  new Component('Wheels', 'Premium air-sprung fork with 200mm travel', [
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
