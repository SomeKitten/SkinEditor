import { BufferAttribute, PerspectiveCamera, Raycaster, Spherical, Vector3 } from 'three'
import { skinName, textureCanvas } from './render'

export const camOrbit = new Vector3()

export const targetS = new Spherical()
export const targetC = { h: 0, s: 0, l: 0 }

export const raycaster = new Raycaster()

const link = document.getElementById('link')!

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

// TODO "save as" instead of "save"
export function download() {
  link.setAttribute('download', (skinName.value.trim() === '' ? 'skin' : skinName.value) + '.png')
  link.setAttribute('href', textureCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
  link.click()
}

export function rgb2hex(rgb: string, def: number) {
  if (rgb.length !== 6) {
    return def
  }

  return Number('0x' + rgb)
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
