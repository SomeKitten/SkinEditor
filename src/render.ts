import { PerspectiveCamera, WebGLRenderer } from 'three'

export let width = window.innerWidth
export let height = window.innerHeight

export function setWidth(value: number) {
  width = value
}
export function setHeight(value: number) {
  height = value
}

export const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
camera.rotation.order = 'ZYX'
camera.position.set(1, 1, 1)

export const renderer = new WebGLRenderer()
renderer.setSize(width, height)
document.body.appendChild(renderer.domElement)
