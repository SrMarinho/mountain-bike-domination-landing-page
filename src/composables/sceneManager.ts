import * as THREE from 'three'

export function useSceneManager() {
  const scene = new THREE.Scene()

  return {
    scene,
    add(object: THREE.Object3D) {
      scene.add(object)
    },
  }
}
