export class UVSection {
  uvs: number[][][]

  constructor(u: number, v: number, x: number, y: number, z: number) {
    // top bottom right front left back
    this.uvs = [
      [
        [u + z, v - z],
        [u + z + x, v],
      ],
      [
        [u + z + x, v],
        [u + z + x + x, v - z],
      ],
      [
        [u, v - z - y],
        [u + z, v - z],
      ],
      [
        [u + z, v - z - y],
        [u + x + z, v - z],
      ],
      [
        [u + z + x, v - z - y],
        [u + z + z + x, v - z],
      ],
      [
        [u + z + x + z, v - z - y],
        [u + z + x + z + x, v - z],
      ],
    ]
  }

  highlight(context: CanvasRenderingContext2D, x: number, y: number) {
    for (const rectangle of this.uvs) {
      if (rectangle[0][0] <= x && x < rectangle[1][0] && rectangle[0][1] <= y && y < rectangle[1][1]) {
        context.fillRect(
          rectangle[0][0],
          64 - rectangle[0][1],
          rectangle[1][0] - rectangle[0][0],
          -(rectangle[1][1] - rectangle[0][1]),
        )
      }
    }
  }
}
