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
  bCanvas,
  camera,
  color,
  ctx,
  gCanvas,
  hCanvas,
  height,
  hsl,
  layer2,
  lCanvas,
  rCanvas,
  renderer,
  rgb,
  sCanvas,
  scene,
  setHeight,
  setWidth,
  updateColor,
  updateTexture,
  width,
} from './render'
import { download, raycaster } from './util'

import upURL from '../res/up_arrow.png'
import upSelectedURL from '../res/up_arrow_selected.png'
import downURL from '../res/down_arrow.png'
import downSelectedURL from '../res/down_arrow_selected.png'
import { clamp } from 'three/src/math/MathUtils'

document.addEventListener('mousemove', onMouseMove)
function onMouseMove(event: MouseEvent) {
  mouse.x = (event.clientX / width) * 2 - 1
  mouse.y = -(event.clientY / height) * 2 + 1

  if (mouseDown && mouseButton == 0) {
    if (picking === 'h') {
      onPickH(clamp(event.clientX, 0, 256))
    } else if (picking === 's') {
      onPickS(clamp(event.clientX, 0, 256))
    } else if (picking === 'l') {
      onPickL(clamp(event.clientX, 0, 256))
    } else if (picking === 'r') {
      onPickR(clamp(event.clientX, 0, 256))
    } else if (picking === 'g') {
      onPickG(clamp(event.clientX, 0, 256))
    } else if (picking === 'b') {
      onPickB(clamp(event.clientX, 0, 256))
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

          ctx!.fillStyle = color.getStyle()
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
function onMouseUp(_event: MouseEvent) {
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
}

document.addEventListener('keyup', onKeyUp)
function onKeyUp(event: KeyboardEvent) {
  if (event.key == 'Shift') {
    setShift(false)
  }
}

window.addEventListener('resize', onWindowResize)
function onWindowResize() {
  setWidth(window.innerWidth)
  setHeight(window.innerHeight)

  renderer.setSize(width, height)

  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

hCanvas.addEventListener('mousedown', (event: MouseEvent) => onPickH(event.x))
sCanvas.addEventListener('mousedown', (event: MouseEvent) => onPickS(event.x))
lCanvas.addEventListener('mousedown', (event: MouseEvent) => onPickL(event.x))

rCanvas.addEventListener('mousedown', (event: MouseEvent) => onPickR(event.x))
gCanvas.addEventListener('mousedown', (event: MouseEvent) => onPickG(event.x))
bCanvas.addEventListener('mousedown', (event: MouseEvent) => onPickB(event.x))

function onPickH(value: number) {
  setPicking('h')
  updateColor('hsl', (value * 360) / 256, hsl.s, hsl.l)
}
function onPickS(value: number) {
  setPicking('s')
  updateColor('hsl', hsl.h, (value * 100) / 256, hsl.l)
}
function onPickL(value: number) {
  setPicking('l')
  updateColor('hsl', hsl.h, hsl.s, (value * 100) / 256)
}

function onPickR(value: number) {
  setPicking('r')
  updateColor('rgb', (value / 256) * 255, rgb.g, rgb.b)
}
function onPickG(value: number) {
  setPicking('g')
  updateColor('rgb', rgb.r, (value / 256) * 255, rgb.b)
}
function onPickB(value: number) {
  setPicking('b')
  updateColor('rgb', rgb.r, rgb.g, (value / 256) * 255)
}

document.getElementById('input-h')?.addEventListener('input', inputH)
function inputH(event: Event) {
  onPickH((clamp(Number((<HTMLInputElement>event.target).value), 0, 360) * 256) / 360)
}
document.getElementById('input-s')?.addEventListener('input', inputS)
function inputS(event: Event) {
  onPickS((clamp(Number((<HTMLInputElement>event.target).value), 0, 100) * 256) / 100)
}
document.getElementById('input-l')?.addEventListener('input', inputL)
function inputL(event: Event) {
  onPickL((clamp(Number((<HTMLInputElement>event.target).value), 0, 100) * 256) / 100)
}
document.getElementById('input-r')?.addEventListener('input', inputR)
function inputR(event: Event) {
  onPickR((clamp(Number((<HTMLInputElement>event.target).value), 0, 255) * 256) / 255)
}
document.getElementById('input-g')?.addEventListener('input', inputG)
function inputG(event: Event) {
  onPickG((clamp(Number((<HTMLInputElement>event.target).value), 0, 255) * 256) / 255)
}
document.getElementById('input-b')?.addEventListener('input', inputB)
function inputB(event: Event) {
  onPickB((clamp(Number((<HTMLInputElement>event.target).value), 0, 255) * 256) / 255)
}

// TODO change icon back no matter where you release
const ups = document.getElementsByClassName('up')
for (const up of ups) {
  up.addEventListener('mousedown', upMouseDown)
  up.addEventListener('mouseup', upMouseUp)
}
const downs = document.getElementsByClassName('down')
for (const down of downs) {
  down.addEventListener('mousedown', downMouseDown)
  down.addEventListener('mouseup', downMouseUp)
}

function upMouseDown(event: Event) {
  ;(<HTMLImageElement>event.target).src = upSelectedURL
}
function upMouseUp(event: Event) {
  ;(<HTMLImageElement>event.target).src = upURL
}
function downMouseDown(event: Event) {
  ;(<HTMLImageElement>event.target).src = downSelectedURL
}
function downMouseUp(event: Event) {
  ;(<HTMLImageElement>event.target).src = downURL
}
