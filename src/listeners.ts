import {
  cameraControls,
  cameraMove,
  drawing,
  mouse,
  mouseButton,
  mouseDown,
  painting,
  picking,
  setCameraMove,
  setMouseButton,
  setMouseDown,
  setPainting,
  setDrawing,
  setPicking,
  setShift,
  shift,
} from './input'
import {
  camera,
  height,
  hotbar,
  hotbarColors,
  hsl,
  layer,
  layers,
  mouseTexture,
  redoStacks,
  renderer,
  rgb,
  scene,
  setAlpha,
  setHeight,
  setHotbar,
  setMouseTexture,
  setWidth,
  showZoom,
  textureCTX,
  undoStacks,
  updateColor,
  updateTexture3D,
  width,
  zoom,
  zoomPos,
  outerLayerVisible,
  outerSkinLayer,
  toggleOuterLayer,
  togglePart,
  enableAltMode,
  disableAltMode,
  innerSkinLayer,
  updateTexture,
  setPlayPlayerModelAnimation,
  playPlayerModelAnimation,
  draggingLayerDiv,
  dragLayer,
  stopDragging,
  getLayerCtx,
  addLayer,
  removeLayer,
  rightSideWidth,
} from './render'
import { download, dragEnd, raycaster, rgb2hex, wrap } from './util'

import upURL from '../res/up_arrow.png'
import upSelectedURL from '../res/up_arrow_selected.png'
import downURL from '../res/down_arrow.png'
import downSelectedURL from '../res/down_arrow_selected.png'
import { clamp } from 'three/src/math/MathUtils'
import { Intersection, Mesh } from 'three'
import {
  aCanvas,
  addLayerDiv,
  bCanvas,
  colorPicker,
  gCanvas,
  hCanvas,
  hotbarCanvas,
  inputAElement,
  inputBElement,
  inputGElement,
  inputHElement,
  inputLElement,
  inputRElement,
  inputResultElement,
  inputSElement,
  lCanvas,
  rCanvas,
  saveDiv,
  sCanvas,
  showCanvas2d,
  skinTypeClassic,
  skinTypeSelect,
  skinTypeSlim,
} from './staticElements'

export const keys: { [key: string]: boolean } = {}
export const codes: { [code: string]: boolean } = {}

const prevDraw: { x: undefined | number; y: undefined | number } = { x: undefined, y: undefined }

window.addEventListener('blur', () => {
  setCameraMove(false)
  setMouseDown(false)
  setPainting(false)
  setDrawing(false)
  setPainting(false)
  setMouseButton(-1)
  setShift(false)
  disableAltMode()
})

document.addEventListener('mousemove', onMouseMove)
function onMouseMove(event: MouseEvent) {
  dragEnd()
  if (draggingLayerDiv) dragLayer(event)

  mouse.x = (event.clientX / width) * 2 - 1
  mouse.y = -(event.clientY / height) * 2 + 1

  if (mouseDown && (mouseButton === 0 || mouseButton === 1 || mouseButton === 2)) {
    switch (picking) {
      case 'h':
        onPickN(onPickH, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 360)
        break
      case 's':
        onPickN(onPickS, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 100)
        break
      case 'l':
        onPickN(onPickL, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 100)
        break
      case 'r':
        onPickN(onPickR, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 255)
        break
      case 'g':
        onPickN(onPickG, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 255)
        break
      case 'b':
        onPickN(onPickB, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 255)
        break
      case 'a':
        onPickN(onPickA, clamp(event.clientX - colorPicker.clientLeft, 0, 256), 255)
        break
      default:
        if (painting) {
          if (mouseButton === 0 || mouseButton === 2) {
            paint()
          } else {
            eyeDropper3D()
          }
        }
    }
  }

  if (cameraMove && mouseButton === 0) {
    cameraControls(event.movementX, event.movementY)
  }
}

function paint() {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    let intersect
    if (shift && outerLayerVisible) {
      intersect = intersects[1]

      if (outerSkinLayer.includes(intersect.object as Mesh)) {
        return
      }
    } else {
      intersect = intersects[0]
    }

    const x = Math.floor(intersect.uv!.x * 64)
    const y = 64 - Math.floor(intersect.uv!.y * 64) - 1

    draw(x, y)

    updateTexture3D()
  }
}

function eyeDropper3D() {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    let intersect
    if (shift && outerLayerVisible) {
      intersect = intersects[1]
      intersectDrop(intersect)
    } else {
      if (!intersectDrop(intersects[0])) {
        intersectDrop(intersects[1])
      }
    }
  }
}

function intersectDrop(intersect: Intersection): boolean {
  const x = Math.floor(intersect.uv!.x * 64)
  const y = 64 - Math.floor(intersect.uv!.y * 64) - 1

  const c = getLayerCtx(layer).getImageData(x, y, 1, 1).data

  setAlpha(c![3])
  updateColor('rgb', c![0], c![1], c![2])

  if (hotbarColors[hotbar].alpha === 0) {
    return false
  }
  return true
}

showCanvas2d.addEventListener('mousemove', onDraw)
function onDraw(this: HTMLElement, event: MouseEvent) {
  drawFromOffset(event.offsetX, event.offsetY)
}

function draw(x: number, y: number, connectPrev: boolean = false) {
  // if starting to draw...
  if (prevDraw.x === undefined || prevDraw.y === undefined) {
    prevDraw.x = x
    prevDraw.y = y

    newCanvasState(undoStacks)
    redoStacks.length = 0
  }

  if (mouseButton === 0) {
    getLayerCtx(layer).fillStyle = `rgb(${hotbarColors[hotbar].color.r * 255}, ${hotbarColors[hotbar].color.g * 255}, ${
      hotbarColors[hotbar].color.b * 255
    }, ${hotbarColors[hotbar].alpha / 255})`

    getLayerCtx(layer).clearRect(x, y, 1, 1)
    getLayerCtx(layer).fillRect(x, y, 1, 1)

    if (connectPrev) {
      line(x, y, prevDraw.x, prevDraw.y)
    }
  } else {
    getLayerCtx(layer).clearRect(x, y, 1, 1)
    clearLine(x, y, prevDraw.x, prevDraw.y)
  }

  prevDraw.x = x
  prevDraw.y = y

  updateTexture(x, 63 - y, '3d')
}

function eyeDropper2D(x: number, y: number) {
  const c = textureCTX.getImageData(x, y, 1, 1).data

  setAlpha(c![3])
  updateColor('rgb', c![0], c![1], c![2])
}

function clearLine(x: number, y: number, x1: number, y1: number) {
  const distX = x1 - x
  const distY = y1 - y
  const steps = Math.sqrt(distX * distX + distY * distY)

  for (let i = 0; i < steps; i++) {
    getLayerCtx(layer).clearRect(Math.floor(x + (distX * i) / steps), Math.floor(y + (distY * i) / steps), 1, 1)
  }
}

function line(x: number, y: number, x1: number, y1: number) {
  const distX = x1 - x
  const distY = y1 - y
  const steps = Math.sqrt(distX * distX + distY * distY)

  for (let i = 0; i < steps; i++) {
    getLayerCtx(layer).clearRect(Math.floor(x + (distX * i) / steps), Math.floor(y + (distY * i) / steps), 1, 1)
    getLayerCtx(layer).fillRect(Math.floor(x + (distX * i) / steps), Math.floor(y + (distY * i) / steps), 1, 1)
  }
}

showCanvas2d.addEventListener('mousedown', onDrawStart)
function onDrawStart(this: HTMLElement, event: MouseEvent) {
  setMouseButton(event.button)

  if (event.button === 0 || event.button === 1 || event.button === 2) {
    setDrawing(true)

    drawFromOffset(event.offsetX, event.offsetY)
  }
}

saveDiv.addEventListener('mousedown', exitSave)
function exitSave(event: Event) {
  if (event instanceof MouseEvent && event.button === 2) return

  saveDiv.hidden = true
}

document.addEventListener('contextmenu', onContextMenu)
function onContextMenu(event: Event) {
  if (saveDiv.hidden) event.preventDefault()
}

function drawFromOffset(x: number, y: number) {
  setMouseTexture(
    (x * 64) / showCanvas2d.width / showZoom + zoomPos.x,
    (y * 64) / showCanvas2d.height / showZoom + zoomPos.y,
  )

  if (drawing) {
    if (mouseButton === 1) {
      eyeDropper2D(Math.floor(mouseTexture.x), Math.floor(mouseTexture.y))
    } else {
      draw(Math.floor(mouseTexture.x), Math.floor(mouseTexture.y), true)
    }
  } else {
    updateTexture(mouseTexture.x, 63 - mouseTexture.y, '3d')
  }
}

document.addEventListener('wheel', (event: WheelEvent) => {
  if (!event.ctrlKey && !event.altKey) {
    setHotbar(wrap(hotbar + (event.deltaY > 0 ? 1 : -1), 0, 8))
  }
})

renderer.domElement.addEventListener('wheel', onZoom3D)
function onZoom3D(event: WheelEvent) {
  if (
    (event.ctrlKey || event.altKey) &&
    !((camera.position.length() < 13 && event.deltaY < 0) || (camera.position.length() > 40 && event.deltaY > 0))
  ) {
    camera.position.multiplyScalar(Math.pow(Math.pow(2, 1 / 4), event.deltaY / 100))
  }

  event.preventDefault()
}

showCanvas2d.addEventListener('wheel', onZoom)
function onZoom(this: HTMLElement, event: WheelEvent) {
  if (event.ctrlKey) {
    zoom(event.deltaY / -100)
    updateTexture()
  }

  event.preventDefault()
}

renderer.domElement.addEventListener('mousemove', (_event: MouseEvent) => {
  updateTexture3D()
})

renderer.domElement.addEventListener('mousedown', onSceneMouseDown)
function onSceneMouseDown(event: MouseEvent) {
  setMouseButton(event.button)

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  if (!event.ctrlKey && intersects.length > 0) {
    if (event.altKey) {
      if (event.button !== 0) return
      let index = innerSkinLayer.indexOf(intersects[0].object as Mesh)
      if (index === -1) return

      togglePart(index)
    } else {
      setPainting(true)
      if (event.button === 0 || event.button === 2) {
        paint()
      } else if (event.button === 1) {
        eyeDropper3D()
      }
    }
  } else {
    setCameraMove(true)
  }
}

document.addEventListener('mousedown', onMouseDown)
function onMouseDown(event: MouseEvent) {
  setMouseDown(true)
  setMouseButton(event.button)
}

document.addEventListener('mouseup', onMouseUp)
function onMouseUp(event: MouseEvent) {
  setCameraMove(false)
  setMouseDown(false)
  setPainting(false)
  setDrawing(false)
  setPicking('')

  if (event.clientX < width - rightSideWidth) {
    newCanvasState(undoStacks)
    removeLayer()
  }
  if (draggingLayerDiv) stopDragging()

  prevDraw.x = undefined
  prevDraw.y = undefined
}

document.addEventListener('keydown', onKeyDown)
function onKeyDown(event: KeyboardEvent) {
  if (!saveDiv.hidden) {
    saveDiv.hidden = true
    return
  }

  if (event.ctrlKey) {
    if (event.code === 'KeyS') {
      download()
      event.preventDefault()
    }

    if (event.code === 'KeyZ') {
      if (event.shiftKey) {
        redo()
      } else {
        undo()
      }
      event.preventDefault()
    }

    if (event.ctrlKey && event.code === 'KeyY') {
      redo()
      event.preventDefault()
    }
  }

  if (event.code === 'Tab') {
    toggleOuterLayer()
    event.preventDefault()
  }

  if (event.key === 'Shift') {
    setShift(true)
    event.preventDefault()
  }

  if (event.key === 'Alt') {
    enableAltMode()
    event.preventDefault()
  }

  if (event.code === 'Space') {
    setPlayPlayerModelAnimation(!playPlayerModelAnimation)
    event.preventDefault()
  }

  updateTexture()

  keys[event.key] = true
  codes[event.code] = true
}

// TODO fix undo flooding when moving camera in 3D view
function undo() {
  if (undoStacks.length > 0) {
    const undoLayers = undoStacks.pop()!
    newCanvasState(redoStacks, undoLayers)
  }
}

function redo() {
  if (redoStacks.length > 0) {
    const redoLayers = redoStacks.pop()!
    newCanvasState(undoStacks, redoLayers)
  }
}

export function newCanvasState(
  stack: { [key: string]: HTMLCanvasElement }[],
  newLayers?: { [key: string]: HTMLCanvasElement },
) {
  console.log('newCanvasState', undoStacks)
  console.log('newCanvasState', redoStacks)

  const stackElement: { [key: string]: HTMLCanvasElement } = {}
  for (let l = 0; l < layers.length; l++) {
    const oldCanvas = document.createElement('canvas')
    oldCanvas.width = 64
    oldCanvas.height = 64
    oldCanvas.getContext('2d')?.drawImage(layers[l], 0, 0)
    stackElement[layers[l].id.slice(0, -7)] = oldCanvas
  }
  stack.push(stackElement)

  if (newLayers) {
    console.log('newLayers', newLayers)
    console.log('layers', layers)

    for (const l in layers) {
      if (!newLayers[layers[l].id.slice(0, -7)]) removeLayer(layers[l])
    }

    for (const newLayer in newLayers) {
      let canvas = document.getElementById(newLayer + '-canvas') as HTMLCanvasElement
      if (!canvas) {
        addLayer(newLayer)
        canvas = document.getElementById(newLayer + '-canvas') as HTMLCanvasElement
      }

      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, 64, 64)
      ctx.drawImage(newLayers[newLayer], 0, 0)
    }
  }
}

document.addEventListener('keyup', onKeyUp)
function onKeyUp(event: KeyboardEvent) {
  if (event.key === 'Shift') {
    setShift(false)
  }

  if (event.key === 'Alt') {
    disableAltMode()
    event.preventDefault()
  }

  updateTexture()

  keys[event.key] = false
  codes[event.code] = false
}

document.addEventListener('dragover', (event: DragEvent) => {
  skinTypeSelect.hidden = false

  if (event.clientX < width / 2) {
    skinTypeClassic.style.backgroundColor = 'var(--background-select)'
    skinTypeSlim.style.backgroundColor = 'var(--background)'
  } else {
    skinTypeClassic.style.backgroundColor = 'var(--background)'
    skinTypeSlim.style.backgroundColor = 'var(--background-select)'
  }

  event.preventDefault()
})

document.addEventListener('dragleave', dragEnd)
document.addEventListener('dragend', dragEnd)

hotbarCanvas.addEventListener('mousedown', hotbarClick)

function hotbarClick(event: MouseEvent) {
  const offset = hotbarCanvas.clientWidth * (1 / 184)
  const size = hotbarCanvas.clientWidth * (20 / 184)

  setHotbar(clamp(Math.floor((event.offsetX - offset) / size), 0, 8))
}

window.addEventListener('resize', onWindowResize)
function onWindowResize() {
  setWidth(window.innerWidth)
  setHeight(window.innerHeight)

  renderer.setSize(width, height)

  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

addLayerDiv.addEventListener('mousedown', () => {
  if (layers.length >= 4) return

  newCanvasState(undoStacks)
  addLayer()
})

hCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('h')
  onPickN(onPickH, event.offsetX, 360)
})
sCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('s')
  onPickN(onPickS, event.offsetX, 100)
})
lCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('l')
  onPickN(onPickL, event.offsetX, 100)
})

rCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('r')
  onPickN(onPickR, event.offsetX, 255)
})
gCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('g')
  onPickN(onPickG, event.offsetX, 255)
})
bCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('b')
  onPickN(onPickB, event.offsetX, 255)
})
aCanvas.addEventListener('mousedown', (event: MouseEvent) => {
  setPicking('a')
  onPickN(onPickA, event.offsetX, 255)
})

function onPickN(func: Function, value: number, n: number) {
  func((value * n) / 256)
}

function onPickH(value: number) {
  updateColor('hsl', value, hsl.s, hsl.l)
}

function onPickS(value: number) {
  updateColor('hsl', hsl.h, value, hsl.l)
}

function onPickL(value: number) {
  updateColor('hsl', hsl.h, hsl.s, value)
}

function onPickR(value: number) {
  updateColor('rgb', value, rgb.g, rgb.b)
}

function onPickG(value: number) {
  updateColor('rgb', rgb.r, value, rgb.b)
}

function onPickB(value: number) {
  updateColor('rgb', rgb.r, rgb.g, value)
}

function onPickA(value: number) {
  setAlpha(Math.floor(value))
  updateColor('rgb', rgb.r, rgb.g, rgb.b)
}

inputHElement.addEventListener('input', inputH)
function inputH(this: HTMLInputElement, _event: Event) {
  onPickH(clamp(Number(this.value), 0, 360))
}

inputSElement.addEventListener('input', inputS)
function inputS(this: HTMLInputElement, _event: Event) {
  onPickS(clamp(Number(this.value), 0, 100))
}

inputLElement.addEventListener('input', inputL)
function inputL(this: HTMLInputElement, _event: Event) {
  onPickL(clamp(Number(this.value), 0, 100))
}

inputRElement.addEventListener('input', inputR)
function inputR(this: HTMLInputElement, _event: Event) {
  onPickR(clamp(Number(this.value), 0, 255))
}

inputGElement.addEventListener('input', inputG)
function inputG(this: HTMLInputElement, _event: Event) {
  onPickG(clamp(Number(this.value), 0, 255))
}

inputBElement.addEventListener('input', inputB)
function inputB(this: HTMLInputElement, _event: Event) {
  onPickB(clamp(Number(this.value), 0, 255))
}

inputAElement.addEventListener('input', inputA)
function inputA(this: HTMLInputElement, _event: Event) {
  onPickA(clamp(Number(this.value), 0, 255))
}

const ups = document.getElementsByClassName('up')
for (const up of ups) {
  up.addEventListener('mousedown', upMouseDown)
  up.addEventListener('mouseenter', function (this: HTMLImageElement, _event: Event) {
    this.src = upSelectedURL
  })
  up.addEventListener('mouseleave', function (this: HTMLImageElement, _event: Event) {
    this.src = upURL
  })
}
const downs = document.getElementsByClassName('down')
for (const down of downs) {
  down.addEventListener('mousedown', downMouseDown)
  down.addEventListener('mouseenter', function (this: HTMLImageElement, _event: Event) {
    this.src = downSelectedURL
  })
  down.addEventListener('mouseleave', function (this: HTMLImageElement, _event: Event) {
    this.src = downURL
  })
}

function upMouseDown(this: HTMLImageElement, _event: Event) {
  switch (this.classList[1]) {
    case 'arrow-h':
      onPickH(clamp(hsl.h + 1, 0, 360))
      break
    case 'arrow-s':
      onPickS(clamp(hsl.s + 1, 0, 100))
      break
    case 'arrow-l':
      onPickL(clamp(hsl.l + 1, 0, 100))
      break
    case 'arrow-r':
      onPickR(clamp(rgb.r + 1, 0, 255))
      break
    case 'arrow-g':
      onPickG(clamp(rgb.g + 1, 0, 255))
      break
    case 'arrow-b':
      onPickB(clamp(rgb.b + 1, 0, 255))
      break
    case 'arrow-a':
      onPickA(clamp(hotbarColors[hotbar].alpha + 1, 0, 255))
      break
  }
}
function downMouseDown(this: HTMLImageElement, _event: Event) {
  switch (this.classList[1]) {
    case 'arrow-h':
      onPickH(clamp(hsl.h - 1, 0, 360))
      break
    case 'arrow-s':
      onPickS(clamp(hsl.s - 1, 0, 100))
      break
    case 'arrow-l':
      onPickL(clamp(hsl.l - 1, 0, 100))
      break
    case 'arrow-r':
      onPickR(clamp(rgb.r - 1, 0, 255))
      break
    case 'arrow-g':
      onPickG(clamp(rgb.g - 1, 0, 255))
      break
    case 'arrow-b':
      onPickB(clamp(rgb.b - 1, 0, 255))
      break
    case 'arrow-a':
      onPickA(clamp(hotbarColors[hotbar].alpha - 1, 0, 255))
      break
  }
}

inputResultElement.addEventListener('input', onResultType)
function onResultType(this: HTMLInputElement, _event: Event) {
  const bar = hotbarColors[hotbar]
  updateColor('hex', rgb2hex(this.value, (bar.color.getHex() << 8) + (bar.alpha & 0xff)), 0, 0)
}

const imgs = document.getElementsByTagName('img')

// ! FIREFOX DRAG FIX
// loop through fetched images
for (const img of imgs) {
  // and define onmousedown event handler
  img.onmousedown = disableDragging
}

function disableDragging(e: Event) {
  e.preventDefault()
}
