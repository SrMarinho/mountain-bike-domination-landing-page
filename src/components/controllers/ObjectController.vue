<template>
  <div
    class="w-4/12 h-6/12 p-1 flex flex-col gap-1 justify-around items-center absolute top-4 right-4 z-[999] bg-gray-400/20 resize rounded-xl text-white"
  >
    <!-- Scene -->
    <div class="w-full flex-1 bg-black/30">
      <ul v-if="scene">
        <li
          v-for="(child, index) in scene.children.value"
          :key="index"
          class="w-full hover:bg-gray-800 px-1 py-0.5"
          :class="{
            'bg-blue-700': objSelected == index,
          }"
          @click="() => (objSelected = index)"
        >
          {{ child.name }}
        </li>
      </ul>
    </div>
    <!-- Obj Properties -->
    <div class="grid grid-cols-3 gap-2 justify-around resize bg-black/30">
      <div class="flex flex-col gap-1">
        <label class="flex text-nowrap gap-2"
          >P. X
          <input
            type="number"
            v-model.number="position.x"
            @input="updatePosition"
            class="w-full bg-black/80 rounded-sm"
            value="0"
            step="0.1"
        /></label>
        <label class="flex text-nowrap gap-2"
          >P. Y
          <input
            type="number"
            v-model.number="position.y"
            @input="updatePosition"
            class="w-full bg-black/80 rounded-sm"
            value="0"
            step="0.1"
        /></label>
        <label class="flex text-nowrap gap-2"
          >P. Z
          <input
            type="number"
            v-model.number="position.z"
            @input="updatePosition"
            class="w-full bg-black/80 rounded-sm"
            value="0"
            step="0.1"
        /></label>
      </div>
      <div class="flex flex-col gap-1">
        <label class="flex text-nowrap gap-2"
          >S. X
          <input
            type="number"
            v-model.number="scale.x"
            @input="updateScale"
            class="w-full bg-black/80 rounded-sm"
            value="1"
            step="0.1"
        /></label>
        <label class="flex text-nowrap gap-2"
          >S. Y
          <input
            type="number"
            v-model.number="scale.y"
            @input="updateScale"
            class="w-full bg-black/80 rounded-sm"
            value="1"
            step="0.1"
        /></label>
        <label class="flex text-nowrap gap-2"
          >S. Z
          <input
            type="number"
            v-model.number="scale.z"
            @input="updateScale"
            class="w-full bg-black/80 rounded-sm"
            value="1"
            step="0.1"
        /></label>
      </div>
      <div class="flex flex-col gap-1">
        <label class="flex text-nowrap gap-2"
          >R. X
          <input
            type="number"
            v-model.number="rotation.x"
            @input="updateRotation"
            class="w-full bg-black/80 rounded-sm"
            value="0"
            step="0.1"
        /></label>
        <label class="flex text-nowrap gap-2"
          >R. Y
          <input
            type="number"
            v-model.number="rotation.y"
            @input="updateRotation"
            class="w-full bg-black/80 rounded-sm"
            value="0"
            step="0.1"
        /></label>
        <label class="flex text-nowrap gap-2"
          >R. Z
          <input
            type="number"
            v-model.number="rotation.z"
            @input="updateRotation"
            class="w-full bg-black/80 rounded-sm"
            value="0"
            step="0.1"
        /></label>
      </div>
    </div>

    <div
      class="absolute w-6 h-6 bg-white top-0 right-0 rounded-full text-black flex justify-center items-center"
      @click="() => (isOpen = !isOpen)"
    >
      X
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Ref } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  scene: {
    children: Ref<THREE.Object3D[]>
  }
}>()

const isOpen = ref<boolean>(false)

const objSelected = ref<number | null>(null)
const selectedObject = computed(() => {
  return objSelected.value !== null ? props.scene.children.value[objSelected.value] : null
})

// Valores reativos para os controles
const position = ref({ x: 0, y: 0, z: 0 })
const rotation = ref({ x: 0, y: 0, z: 0 })
const scale = ref({ x: 1, y: 1, z: 1 })

// Atualiza os controles quando o objeto selecionado muda
watch(
  selectedObject,
  (obj) => {
    if (obj) {
      position.value = {
        x: obj.position.x,
        y: obj.position.y,
        z: obj.position.z,
      }
      rotation.value = {
        x: obj.rotation.x,
        y: obj.rotation.y,
        z: obj.rotation.z,
      }
      scale.value = {
        x: obj.scale.x,
        y: obj.scale.y,
        z: obj.scale.z,
      }
    }
  },
  { immediate: true },
)

// Funções para atualizar o objeto 3D
const updatePosition = () => {
  if (selectedObject.value) {
    selectedObject.value.position.set(position.value.x, position.value.y, position.value.z)
  }
}

const updateRotation = () => {
  if (selectedObject.value) {
    selectedObject.value.rotation.set(rotation.value.x, rotation.value.y, rotation.value.z)
  }
}

const updateScale = () => {
  if (selectedObject.value) {
    selectedObject.value.scale.set(scale.value.x, scale.value.y, scale.value.z)
  }
}
</script>
<style scoped></style>
