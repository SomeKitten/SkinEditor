import defaultSkinURLClassic from '../res/shauapufu.png'
import defaultSkinURLSlim from '../res/neferupitou.png'
import plusURL from '../res/plus.png'
import minusURL from '../res/minus.png'
import plusSelectedURL from '../res/plus_selected.png'
import minusSelectedURL from '../res/minus_selected.png'
import undoURL from '../res/undo.png'
import redoURL from '../res/redo.png'
import undoSelectedURL from '../res/undo_selected.png'
import redoSelectedURL from '../res/redo_selected.png'
import outerLayerURL from '../res/toggle_skin_outer.png'
import outerLayer2URL from '../res/toggle_skin_outer2.png'
import outerLayerBlueURL from '../res/toggle_skin_outer_blue.png'
import outerLayer2BlueURL from '../res/toggle_skin_outer2_blue.png'
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
  updateTexture3D,
  width,
  zoom,
  zoomPos,
  outerLayerVisible,
  outerSkinLayer,
  toggleOuterLayer,
  togglePartAlt,
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
  setLayer,
  toggleClassicSlimModel,
  togglePart,
  setClassicSlimModel,
  updateColorRGB,
  updateColorHSL,
  updateColorHex,
} from './render'
import { download, raycaster, rgb2hex, wrap } from './util'

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
  dragOverlay,
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
  redoButton,
  removeLayerDiv,
  saveDiv,
  sCanvas,
  showCanvas2d,
  skinTypeClassic,
  skinTypeSelect,
  skinTypeSlim,
  toggleBodyButton,
  toggleHeadButton,
  toggleLeftArmButton,
  toggleLeftLegButton,
  toggleOuterButton,
  toggleRightArmButton,
  toggleRightLegButton,
  toggleSkinType,
  undoButton,
} from './staticElements'

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

  const c = textureCTX.getImageData(x, y, 1, 1).data

  setAlpha(c![3])
  updateColorRGB(c![0], c![1], c![2])

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
  if (x < 0 || y < 0 || x > 63 || y > 63) {
    prevDraw.x = undefined
    prevDraw.y = undefined
    return
  }

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
  updateColorRGB(c![0], c![1], c![2])
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

      togglePartAlt(index)
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
function onMouseUp(_event: MouseEvent) {
  setCameraMove(false)
  setMouseDown(false)
  setPainting(false)
  setDrawing(false)
  setPicking('')

  if (draggingLayerDiv) stopDragging()

  prevDraw.x = undefined
  prevDraw.y = undefined
}

undoButton.addEventListener('click', undo)
redoButton.addEventListener('click', redo)

let toggleOuterButtonHover = false
toggleOuterButton.addEventListener('click', () => {
  toggleOuterLayer(toggleOuterButtonHover)
})
toggleOuterButton.addEventListener('mouseleave', () => {
  toggleOuterButtonHover = false

  if (outerLayerVisible) {
    ;(toggleOuterButton.children[0] as HTMLImageElement).src = outerLayer2URL
  } else {
    ;(toggleOuterButton.children[0] as HTMLImageElement).src = outerLayerURL
  }
})
toggleOuterButton.addEventListener('mouseenter', () => {
  toggleOuterButtonHover = true

  if (outerLayerVisible) {
    ;(toggleOuterButton.children[0] as HTMLImageElement).src = outerLayer2BlueURL
  } else {
    ;(toggleOuterButton.children[0] as HTMLImageElement).src = outerLayerBlueURL
  }
})

toggleHeadButton.addEventListener('click', () => {
  togglePart(0)
})
toggleBodyButton.addEventListener('click', () => {
  togglePart(1)
})
toggleRightArmButton.addEventListener('click', () => {
  togglePart(2)
})
toggleLeftArmButton.addEventListener('click', () => {
  togglePart(3)
})
toggleRightLegButton.addEventListener('click', () => {
  togglePart(4)
})
toggleLeftLegButton.addEventListener('click', () => {
  togglePart(5)
})

document.addEventListener('keydown', onKeyDown)
function onKeyDown(event: KeyboardEvent) {
  const eventKey = event.key.toLowerCase()

  if (!saveDiv.hidden) {
    saveDiv.hidden = true
    return
  }

  if (event.ctrlKey) {
    if (eventKey === 's') {
      download()
      event.preventDefault()
    }

    if (eventKey === 'z') {
      if (event.shiftKey) {
        redo()
      } else {
        undo()
      }
      event.preventDefault()
    }

    if (event.ctrlKey && eventKey === 'y') {
      redo()
      event.preventDefault()
    }
  }

  if (eventKey === 'tab') {
    toggleOuterLayer()
    event.preventDefault()
  }

  if (eventKey === 'shift') {
    setShift(true)
    event.preventDefault()
  }

  if (eventKey === 'alt') {
    enableAltMode()
    event.preventDefault()
  }

  // space key
  if (eventKey === ' ') {
    setPlayPlayerModelAnimation(!playPlayerModelAnimation)
    event.preventDefault()
  }

  updateTexture()
}

function undo() {
  if (undoStacks.length > 0) {
    const undoLayers = undoStacks.pop()!
    newCanvasState(redoStacks, undoLayers)
  }

  updateTexture()
}

function redo() {
  if (redoStacks.length > 0) {
    const redoLayers = redoStacks.pop()!
    newCanvasState(undoStacks, redoLayers)
  }

  updateTexture()
}

// TODO keep layer order when undoing/redoing
export function newCanvasState(
  stack: { [key: string]: HTMLCanvasElement }[],
  newLayers?: { [key: string]: HTMLCanvasElement },
) {
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
  const eventKey = event.key.toLowerCase()

  if (eventKey === 'shift') {
    setShift(false)
  }

  if (eventKey === 'alt') {
    disableAltMode()
    event.preventDefault()
  }

  updateTexture()
}

document.addEventListener('dragover', (event: DragEvent) => {
  dragOverlay.hidden = false

  event.preventDefault()
})

dragOverlay.addEventListener('dragleave', () => {
  dragOverlay.hidden = true
})
document.addEventListener('dragend', () => {
  dragOverlay.hidden = true
})

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

// TODO remove layer limit and add scrolling
addLayerDiv.addEventListener('mousedown', () => {
  if (layers.length >= 4) return

  newCanvasState(undoStacks)
  addLayer()
})

removeLayerDiv.addEventListener('mousedown', () => {
  if (layers.length <= 1) {
    // TODO display message that you can't remove the last layer
    return
  }

  newCanvasState(undoStacks)
  removeLayer(layers[layer])
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
  updateColorHSL(value, hsl.s, hsl.l)
}

function onPickS(value: number) {
  updateColorHSL(hsl.h, value, hsl.l)
}

function onPickL(value: number) {
  updateColorHSL(hsl.h, hsl.s, value)
}

function onPickR(value: number) {
  updateColorRGB(value, rgb.g, rgb.b)
}

function onPickG(value: number) {
  updateColorRGB(rgb.r, value, rgb.b)
}

function onPickB(value: number) {
  updateColorRGB(rgb.r, rgb.g, value)
}

function onPickA(value: number) {
  setAlpha(Math.floor(value))
  updateColorRGB(rgb.r, rgb.g, rgb.b)
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
  updateColorHex(rgb2hex(this.value, (bar.color.getHex() << 8) + (bar.alpha & 0xff)))
}

const textureImage = document.createElement('img')
textureImage.addEventListener('load', () => {
  if (textureImage.width === 64 && (textureImage.height === 64 || textureImage.height === 32)) {
    setTexture(textureImage)
  } else {
    // TODO alert about skin size
  }
})

const fileReader = new FileReader()
fileReader.addEventListener(
  'load',
  function () {
    textureImage.src = <string>fileReader.result
  },
  false,
)

// TODO add name-search skin importing
function setTexture(image: HTMLImageElement) {
  const newLayer = addLayer()
  const newCtx = newLayer.getContext('2d')!
  newCtx.clearRect(0, 0, 64, 64)
  newCtx.drawImage(image, 0, 0)

  setLayer(newLayer)
  updateTexture()
}

toggleSkinType.addEventListener('click', toggleClassicSlimModel)

skinTypeClassic.addEventListener('click', () => {
  setClassicSlimModel('classic')
  textureImage.src = defaultSkinURLClassic
  skinTypeSelect.hidden = true
})
skinTypeSlim.addEventListener('click', () => {
  setClassicSlimModel('slim')
  textureImage.src = defaultSkinURLSlim
  skinTypeSelect.hidden = true
})

document.addEventListener('drop', (event: DragEvent) => {
  dragOverlay.hidden = true
  disableAltMode()

  event.preventDefault()

  if (layers.length >= 4) return

  newCanvasState(undoStacks)

  if (event.dataTransfer?.items) {
    if (event.dataTransfer.items[0].kind === 'file') {
      const file = event.dataTransfer.items[0].getAsFile()
      if (file?.name.endsWith('png')) {
        fileReader.readAsDataURL(file)
      }
    }
  } else {
    const file = event.dataTransfer!.files[0]
    if (file.name.endsWith('png')) {
      fileReader.readAsDataURL(file)
    }
  }
})

addLayerDiv.addEventListener('mouseleave', () => {
  ;(addLayerDiv.children[0] as HTMLImageElement).src = plusURL
})
addLayerDiv.addEventListener('mouseenter', () => {
  ;(addLayerDiv.children[0] as HTMLImageElement).src = plusSelectedURL
})

removeLayerDiv.addEventListener('mouseleave', () => {
  ;(removeLayerDiv.children[0] as HTMLImageElement).src = minusURL
})
removeLayerDiv.addEventListener('mouseenter', () => {
  ;(removeLayerDiv.children[0] as HTMLImageElement).src = minusSelectedURL
})

undoButton.addEventListener('mouseleave', () => {
  ;(undoButton.children[0] as HTMLImageElement).src = undoURL
})
undoButton.addEventListener('mouseenter', () => {
  ;(undoButton.children[0] as HTMLImageElement).src = undoSelectedURL
})

redoButton.addEventListener('mouseleave', () => {
  ;(redoButton.children[0] as HTMLImageElement).src = redoURL
})
redoButton.addEventListener('mouseenter', () => {
  ;(redoButton.children[0] as HTMLImageElement).src = redoSelectedURL
})

const imgs = document.getElementsByTagName('img')

// ! FIREFOX DRAG FIX
for (const img of imgs) {
  img.ondragstart = disableDragging
}

function disableDragging(e: Event) {
  e.preventDefault()
}
