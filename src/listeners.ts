import {
  cameraControls,
  mouse,
  mouseDown,
  painting,
  setMouseButton,
  setMouseDown,
  setMouseDrag,
  setPainting,
  setShift,
  shift,
} from './input'
import { camera, ctx, height, layer2, renderer, scene, setHeight, setWidth, updateTexture, width } from './render'
import { download, raycaster } from './util'

document.addEventListener('mousemove', onMouseMove)
function onMouseMove(event: MouseEvent) {
  mouse.x = (event.clientX / width) * 2 - 1
  mouse.y = -(event.clientY / height) * 2 + 1

  if (mouseDown) {
    if (painting) {
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children)

      if (intersects.length > 0) {
        let intersect
        if (!shift && layer2.visible) {
          intersect = intersects[0]
        } else {
          intersect = intersects[1]
        }
        const x = Math.floor(intersect.uv!.x * 64)
        const y = Math.floor(intersect.uv!.y * 64)

        ctx?.fillRect(x, 64 - y - 1, 1, 1)
        updateTexture()
      }
    } else {
      cameraControls(event.movementX, event.movementY)
    }
  }

  setMouseDrag(true)
}

document.addEventListener('mousedown', onMouseDown)
function onMouseDown(event: MouseEvent) {
  event.preventDefault()

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    setPainting(true)
  }

  setMouseDown(true)
  setMouseButton(event.button)
  setMouseDrag(false)
}

document.addEventListener('mouseup', onMouseUp)
function onMouseUp(event: MouseEvent) {
  event.preventDefault()

  setPainting(false)
  setMouseDown(false)
}

document.addEventListener('keydown', onKeyDown)
function onKeyDown(event: KeyboardEvent) {
  if (event.ctrlKey && event.code == 'KeyS') {
    download()
  }

  if (event.code == 'Tab') {
    layer2.visible = !layer2.visible
  }

  if (event.key == 'Shift') {
    setShift(true)
  }

  event.preventDefault()
}

document.addEventListener('keyup', onKeyUp)
function onKeyUp(event: KeyboardEvent) {
  if (event.key == 'Shift') {
    setShift(false)
  }

  event.preventDefault()
}

window.addEventListener('resize', onWindowResize)
function onWindowResize() {
  setWidth(window.innerWidth)
  setHeight(window.innerHeight)

  renderer.setSize(width, height)

  camera.aspect = width / height
  camera.updateProjectionMatrix()
}
