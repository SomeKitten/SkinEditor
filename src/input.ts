import { Vector2 } from 'three'
import { camera } from './render'
import { camOrbit, lookAt, rotateSpherical, targetS } from './util'

export const mouse = new Vector2()
export let mouseDrag = false
export let mouseDown = false
export let painting = false
export let picking = ''
export let mouseButton = -1
export const sensitivity = 0.007

export let shift = false

export function setMouseDrag(value: boolean) {
  mouseDrag = value
}
export function setMouseDown(value: boolean) {
  mouseDown = value
}
export function setPainting(value: boolean) {
  painting = value
}
export function setPicking(value: string) {
  picking = value
}
export function setMouseButton(value: number) {
  mouseButton = value
}
export function setShift(value: boolean) {
  shift = value
}

export function cameraControls(movementX: number, movementY: number) {
  targetS.setFromVector3(camera.position)
  rotateSpherical(targetS, movementY * sensitivity, movementX * sensitivity)

  let adjust = 0
  let tolerance = 0.01
  if (targetS.phi < tolerance) {
    adjust = tolerance - targetS.phi
  }
  if (targetS.phi > Math.PI - tolerance) {
    adjust = Math.PI - tolerance - targetS.phi
  }
  targetS.phi += adjust

  camera.position.setFromSpherical(targetS)

  lookAt(camera, camOrbit)
}
