import { cameraControls, mouse, mouseDown, setMouseButton, setMouseDown, setMouseDrag } from './input'
import { camera, height, renderer, setHeight, setWidth, width } from './render'

document.addEventListener('mousemove', onMouseMove)
function onMouseMove(event: MouseEvent) {
  mouse.x = (event.clientX / width) * 2 - 1
  mouse.y = -(event.clientY / height) * 2 + 1

  if (mouseDown) {
    cameraControls(event.movementX, event.movementY)
  }

  setMouseDrag(true)
}

document.addEventListener('mousedown', onMouseDown)
export function onMouseDown(event: MouseEvent) {
  event.preventDefault()

  setMouseDown(true)
  setMouseButton(event.button)
  setMouseDrag(false)
}

document.addEventListener('mouseup', onMouseUp)
function onMouseUp(event: MouseEvent) {
  event.preventDefault()

  setMouseDown(false)
}

window.addEventListener('resize', onWindowResize)
function onWindowResize() {
  setWidth(window.innerWidth)
  setHeight(window.innerHeight)

  renderer.setSize(width, height)

  camera.aspect = width / height
  camera.updateProjectionMatrix()
}
