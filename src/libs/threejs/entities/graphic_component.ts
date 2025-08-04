import { Object3D } from 'three'
import type { ComponentInterface } from '../interfaces/component_interface'
import type { TransformationComponent } from './transformation_component'

class GraphicComponent implements ComponentInterface {
  private object3D: Object3D
  private transform: TransformationComponent | null

  constructor(object3D: Object3D) {
    this.object3D = object3D
    this.transform = null
  }
  dispose(): void {
    throw new Error('Method not implemented.')
  }

  public setTransformationComponent(transform: TransformationComponent): void {
    this.transform = transform
    this.syncWithTransform()
  }

  public update(deltaTime: number): void {
    if (this.transform) {
      this.syncWithTransform()
    }
  }

  private syncWithTransform(): void {
    if (!this.transform) return

    this.object3D.position.copy(this.transform.position)
    this.object3D.quaternion.copy(this.transform.rotation)
    this.object3D.scale.copy(this.transform.scale)
  }

  public getObject3D(): Object3D {
    return this.object3D
  }
}

export { GraphicComponent }
