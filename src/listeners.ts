import {
  cameraControls,
  mouse,
  mouseButton,
  mouseDown,
  painting,
  picking,
  setMouseButton,
  setMouseDown,
  setMouseDrag,
  setPainting,
  setPicking,
  setShift,
  shift,
} from './input'
import {
  camera,
  colorPicker,
  ctx,
  height,
  layer2,
  pickColor,
  renderer,
  scene,
  setHeight,
  setWidth,
  updateColor,
  updateTexture,
  width,
} from './render'
import { download, raycaster, targetC } from './util'

document.addEventListener('mousemove', onMouseMove)
function onMouseMove(event: MouseEvent) {
  mouse.x = (event.clientX / width) * 2 - 1
  mouse.y = -(event.clientY / height) * 2 + 1

  if (mouseDown && mouseButton == 0) {
    if (picking === 'h') {
      onPickH(Math.min(Math.max(0, event.clientX), 255))
    } else if (picking === 's') {
      onPickS(Math.min(Math.max(0, event.clientX), 255))
    } else if (picking === 'l') {
      onPickL(Math.min(Math.max(0, event.clientX), 255))
    } else {
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

          ctx!.fillStyle = pickColor.getStyle()
          ctx?.fillRect(x, 64 - y - 1, 1, 1)
          updateTexture()
        }
      } else {
        cameraControls(event.movementX, event.movementY)
      }
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

  setMouseDown(false)
  setPainting(false)
  setPicking('')
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

colorPicker.addEventListener('mousedown', onPick)
function onPick(event: MouseEvent) {
  if (event.y > 32) {
    if (event.y < 64) {
      onPickH(event.x)
    } else if (event.y < 96) {
      onPickS(event.x)
    } else if (event.y < 128) {
      onPickL(event.x)
    }
  }
}

function onPickH(value: number) {
  setPicking('h')
  pickColor.getHSL(targetC)
  updateColor('hsl', (value * 360) / 256, targetC.s * 100, targetC.l * 100)
}

function onPickS(value: number) {
  setPicking('s')
  pickColor.getHSL(targetC)
  updateColor('hsl', targetC.h * 360, (value * 100) / 256, targetC.l * 100)
}

function onPickL(value: number) {
  setPicking('l')
  pickColor.getHSL(targetC)
  updateColor('hsl', targetC.h * 360, targetC.s * 100, (value * 100) / 256)
}
