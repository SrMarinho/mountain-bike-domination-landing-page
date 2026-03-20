// physic_component.ts
import { Vector3 } from 'three'
import type { ComponentInterface } from '../interfaces/component_interface'
import { TransformationComponent } from './transformation_component'

class PhysicComponent implements ComponentInterface {
  private velocity: Vector3
  private mass: number
  private transform: TransformationComponent | null

  constructor(mass: number = 1) {
    this.velocity = new Vector3()
    this.mass = mass
    this.transform = null
  }
  dispose(): void {
    this.velocity.set(0, 0, 0)
    this.transform = null
  }

  public setTransformationComponent(transform: TransformationComponent): void {
    this.transform = transform
  }

  public update(deltaTime: number): void {
    if (!this.transform) return

    // Atualiza posição
    this.transform.position.add(this.velocity.clone().multiplyScalar(deltaTime))
  }
}

export { PhysicComponent }
