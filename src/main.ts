import './style.css'
import './listeners'
import { camera, renderer, scene } from './render'
import { camOrbit, lookAt } from './util'

lookAt(camera, camOrbit)

const animate = function () {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
}

animate()
