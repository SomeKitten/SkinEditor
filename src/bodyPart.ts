import { BoxGeometry, BufferAttribute, Mesh, Vector3 } from 'three'
import {
  blackMat,
  innerSkinLayer,
  layer1Mat,
  layer2Mat,
  outerLayerVisible,
  outerSkinLayer,
  scene,
  whiteMat,
} from './render'

export class BodyPart {
  innerLayer: Mesh
  outerLayer: Mesh
  visible: boolean = true

  constructor(layer1UVS: BufferAttribute, layer2UVS: BufferAttribute, pos: Vector3, size: Vector3) {
    const layer1Geometry = new BoxGeometry(size.x, size.y, size.z)
    layer1Geometry.setAttribute('uv', layer1UVS)

    // TODO head 2nd layer is +1, not +0.5
    const layer2Geometry = new BoxGeometry(size.x + 0.5, size.y + 0.5, size.z + 0.5)
    layer2Geometry.setAttribute('uv', layer2UVS)

    this.innerLayer = new Mesh(layer1Geometry, layer1Mat)
    this.innerLayer.position.copy(pos)
    innerSkinLayer.push(this.innerLayer)
    scene.add(this.innerLayer)

    this.outerLayer = new Mesh(layer2Geometry, layer2Mat)
    this.outerLayer.position.copy(pos)
    outerSkinLayer.push(this.outerLayer)
    scene.add(this.outerLayer)
  }

  enableAltMode() {
    this.innerLayer.material = whiteMat
    if (!this.visible) {
      this.innerLayer.material = blackMat

      scene.add(this.innerLayer)
    } else {
      scene.remove(this.outerLayer)
    }
  }

  disableAltMode() {
    if (!this.visible) {
      scene.remove(this.innerLayer)
    } else if (outerLayerVisible) {
      scene.add(this.outerLayer)
    }

    this.innerLayer.material = layer1Mat
  }

  setVisible(visible: boolean) {
    console.log('setVisible', visible)
    this.visible = visible
    if (visible) {
      this.innerLayer.material = whiteMat
    } else {
      this.innerLayer.material = blackMat
    }
  }
}
