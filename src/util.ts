import { BufferAttribute, PerspectiveCamera, Raycaster, Spherical, Vector3 } from 'three'
import { saveDiv, textureCanvas, textureImage } from './staticElements'

export const camOrbit = new Vector3()

export const targetS = new Spherical()
export const targetC = { h: 0, s: 0, l: 0 }

export const raycaster = new Raycaster()

export function rotateSpherical(spherical: Spherical, angleX: number, angleY: number) {
  spherical.theta -= angleY
  spherical.phi = spherical.phi - angleX
}

export function lookAt(obj: PerspectiveCamera, focus: Vector3) {
  let offset = focus.clone()
  offset.sub(obj.position)

  obj.rotation.y = -Math.atan2(offset.x, -offset.z)
  obj.rotation.x = Math.atan2(offset.y, Math.sqrt(offset.x * offset.x + offset.z * offset.z))
  obj.rotation.z = 0
}

export function genBlockUVs(u: number, v: number, x: number, y: number, z: number, texturew: number, textureh: number) {
  // bl, br, tl, tr
  let top = [
    [u + z, v],
    [u + z + x, v],
    [u + z, v - z],
    [u + z + x, v - z],
  ]

  let bottom = [
    [u + z + x, v - z],
    [u + z + x + x, v - z],
    [u + z + x, v],
    [u + z + x + x, v],
  ]

  let right = [
    [u, v - z],
    [u + z, v - z],
    [u, v - z - y],
    [u + z, v - z - y],
  ]

  let front = [
    [u + z, v - z],
    [u + x + z, v - z],
    [u + z, v - z - y],
    [u + x + z, v - z - y],
  ]

  let left = [
    [u + z + x, v - z],
    [u + z + z + x, v - z],
    [u + z + x, v - z - y],
    [u + z + z + x, v - z - y],
  ]

  let back = [
    [u + z + x + z, v - z],
    [u + z + x + z + x, v - z],
    [u + z + x + z, v - z - y],
    [u + z + x + z + x, v - z - y],
  ]

  let uvs_all = []

  for (let uv of left) {
    uvs_all.push(uv[0] / texturew)
    uvs_all.push(uv[1] / textureh)
  }
  for (let uv of right) {
    uvs_all.push(uv[0] / texturew)
    uvs_all.push(uv[1] / textureh)
  }
  for (let uv of top) {
    uvs_all.push(uv[0] / texturew)
    uvs_all.push(uv[1] / textureh)
  }
  for (let uv of bottom) {
    uvs_all.push(uv[0] / texturew)
    uvs_all.push(uv[1] / textureh)
  }
  for (let uv of front) {
    uvs_all.push(uv[0] / texturew)
    uvs_all.push(uv[1] / textureh)
  }
  for (let uv of back) {
    uvs_all.push(uv[0] / texturew)
    uvs_all.push(uv[1] / textureh)
  }

  return new BufferAttribute(new Float32Array(uvs_all), 2)
}

export function download() {
  saveDiv.hidden = false
  textureImage.src = textureCanvas.toDataURL()
}

// def: default
export function rgb2hex(rgb: string, def: number) {
  const rgbNum = Number('0x' + rgb)
  if (rgb.length !== 8 || !rgbNum) return def
  return rgbNum
}

export function wrap(value: number, min: number, max: number) {
  if (value > max) {
    return min + value - max - 1
  }
  if (value < min) {
    return max - (min - value - 1)
  }

  return value
}

export function strokeRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillRect(x, y, w, 1)
  ctx.fillRect(x, y + h - 1, w, 1)
  ctx.fillRect(x, y, 1, h)
  ctx.fillRect(x + w - 1, y, 1, h)
}

export function compileLayers(ctx: CanvasRenderingContext2D, layers: HTMLCanvasElement[]) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (const layer of layers) {
    ctx.drawImage(layer, 0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}
