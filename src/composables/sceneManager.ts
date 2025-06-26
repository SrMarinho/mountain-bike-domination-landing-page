import { ref } from 'vue'
import * as THREE from 'three'

export function useSceneManager() {
  const scene = new THREE.Scene()
  const children = ref<THREE.Object3D[]>([])

  // Only make the parts you need reactive
  return {
    // Raw Three.js scene (non-reactive)
    scene,

    // Reactive children array
    children,

    add(object: THREE.Object3D) {
      scene.add(object)
      children.value = [...scene.children]
    },

    remove(object: THREE.Object3D) {
      scene.remove(object)
      children.value = [...scene.children]
    },
  }
}
