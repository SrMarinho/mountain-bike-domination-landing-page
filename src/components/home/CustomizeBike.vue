<template>
  <div
    class="w-full p-6 flex flex-col justify-center items-center bg-gradient-to-b from-black to-black-light"
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
    <div class="w-full text-white flex flex-wrap gap-7">
      <div class="w-full grid grid-cols-2 grid-rows-2 gap-4">
        <div
          v-for="(component, index) in components"
          :key="index"
          class="w-full flex flex-col gap-3 rounded-xl bg-black-light-2/50 p-6 outline-gray-600 outline-2 outline-solid duration-300"
          :class="{
            'bg-primary/15 outline-primary text-primary ': currentComponent == index,
          }"
          @click="() => (currentComponent = index)"
        >
          <p class="text-xl font-bold">{{ component.title }}</p>
          <p class="text-sm">{{ component.description }}</p>
        </div>
      </div>
      <div class="w-full rounded-xl bg-black-light-2/50 p-6 border-solid border-gray-600 border-1">
        <p class="text-xl font-bold text-primary">
          {{ `${components[currentComponent].title} Specs` }}
        </p>
        <g class="" v-for="(spec, index) in components[currentComponent].specs" :key="index">
          <span class="w-2 h-2 rounded-full bg-green-400"></span>
          <p>{{ spec }}</p>
        </g>
      </div>
      <div class="w-full rounded-xl bg-black-light-2/50 p-6 border-solid border-gray-600 border-1">
        <p class="font-bold text-xl">Performace Matric</p>
        <div>
          <div>
            <span>Weight</span>
            <span>16.2</span>
          </div>
          <div>
            <span>Travel</span>
            <span>200mm / 200mm</span>
          </div>
          <div>
            <span>Max Speed</span>
            <span>80+ km/h</span>
          </div>
        </div>
        <button class="w-full bg-gradient-to-r from-cyan-400 to-green-400">BUILD THIS SETUP</button>
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
