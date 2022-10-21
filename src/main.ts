import './style.css'
import { animatePlayerModel, camera, playPlayerModelAnimation, renderer, scene } from './render'
import { camOrbit, lookAt } from './util'
import './listeners'
import './tooltip'

lookAt(camera, camOrbit)

const animate = function () {
  requestAnimationFrame(animate)

  if (playPlayerModelAnimation) animatePlayerModel()
  renderer.render(scene, camera)
}

animate()
