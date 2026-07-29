<template>
  <div class="dice-visual" :class="{ rolling }">
    <canvas ref="canvas" aria-hidden="true"></canvas>
    <div class="ground-shadow" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  sides: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  rolling: {
    type: Boolean,
    default: false,
  },
})

const canvas = ref(null)
const PHI = (1 + Math.sqrt(5)) / 2
const EPSILON = 0.0001

let context = null
let resizeObserver = null
let animationFrame = null
let lastTime = 0
let width = 0
let height = 0

const rotations = [
  { x: -0.42, y: 0.62, z: 0.08, vx: 0, vy: 0, vz: 0 },
  { x: -0.2, y: -0.48, z: -0.1, vx: 0, vy: 0, vz: 0 },
]

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const subtract = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
const magnitude = (vector) => Math.hypot(...vector)
const normalize = (vector) => {
  const length = magnitude(vector) || 1
  return vector.map((value) => value / length)
}

function normalizeVertices(vertices) {
  const radius = Math.max(...vertices.map(magnitude))
  return vertices.map((vertex) => vertex.map((value) => value / radius))
}

function convexFaces(vertices) {
  const faceSets = new Map()

  for (let a = 0; a < vertices.length - 2; a += 1) {
    for (let b = a + 1; b < vertices.length - 1; b += 1) {
      for (let c = b + 1; c < vertices.length; c += 1) {
        const normal = cross(
          subtract(vertices[b], vertices[a]),
          subtract(vertices[c], vertices[a]),
        )
        if (magnitude(normal) < EPSILON) continue

        const distances = vertices.map((vertex) =>
          dot(normal, subtract(vertex, vertices[a])),
        )
        const isHullPlane =
          distances.every((distance) => distance <= EPSILON) ||
          distances.every((distance) => distance >= -EPSILON)

        if (!isHullPlane) continue

        const face = distances
          .map((distance, index) => ({ distance, index }))
          .filter(({ distance }) => Math.abs(distance) <= EPSILON)
          .map(({ index }) => index)
          .sort((left, right) => left - right)

        if (face.length >= 3) faceSets.set(face.join('-'), face)
      }
    }
  }

  return [...faceSets.values()].map((indices) => {
    const center = indices
      .map((index) => vertices[index])
      .reduce(add, [0, 0, 0])
      .map((value) => value / indices.length)

    let normal = normalize(
      cross(
        subtract(vertices[indices[1]], vertices[indices[0]]),
        subtract(vertices[indices[2]], vertices[indices[0]]),
      ),
    )
    if (dot(normal, center) < 0) normal = normal.map((value) => -value)

    const axisX = normalize(subtract(vertices[indices[0]], center))
    const axisY = normalize(cross(normal, axisX))
    const ordered = [...indices].sort((left, right) => {
      const leftVector = subtract(vertices[left], center)
      const rightVector = subtract(vertices[right], center)
      const leftAngle = Math.atan2(dot(leftVector, axisY), dot(leftVector, axisX))
      const rightAngle = Math.atan2(dot(rightVector, axisY), dot(rightVector, axisX))
      return leftAngle - rightAngle
    })

    return ordered
  })
}

function makeGeometry(vertices) {
  const normalizedVertices = normalizeVertices(vertices)
  return {
    vertices: normalizedVertices,
    faces: convexFaces(normalizedVertices),
  }
}

function ringVertices(count, radius = 1, z = 0) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2
    return [Math.cos(angle) * radius, Math.sin(angle) * radius, z]
  })
}

const geometries = {
  4: makeGeometry([
    [1, 1, 1],
    [-1, -1, 1],
    [-1, 1, -1],
    [1, -1, -1],
  ]),
  6: makeGeometry([
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ]),
  8: makeGeometry([
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ]),
  10: makeGeometry([
    [0, 0, 1.35],
    [0, 0, -1.35],
    ...ringVertices(5),
  ]),
  12: makeGeometry([
    [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1],
    [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1],
    [0, -1 / PHI, -PHI], [0, -1 / PHI, PHI],
    [0, 1 / PHI, -PHI], [0, 1 / PHI, PHI],
    [-1 / PHI, -PHI, 0], [-1 / PHI, PHI, 0],
    [1 / PHI, -PHI, 0], [1 / PHI, PHI, 0],
    [-PHI, 0, -1 / PHI], [PHI, 0, -1 / PHI],
    [-PHI, 0, 1 / PHI], [PHI, 0, 1 / PHI],
  ]),
  20: makeGeometry([
    [0, -1, -PHI], [0, -1, PHI], [0, 1, -PHI], [0, 1, PHI],
    [-1, -PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [1, PHI, 0],
    [-PHI, 0, -1], [PHI, 0, -1], [-PHI, 0, 1], [PHI, 0, 1],
  ]),
}

function rotateVertex(vertex, rotation) {
  let [x, y, z] = vertex

  const cosX = Math.cos(rotation.x)
  const sinX = Math.sin(rotation.x)
  ;[y, z] = [y * cosX - z * sinX, y * sinX + z * cosX]

  const cosY = Math.cos(rotation.y)
  const sinY = Math.sin(rotation.y)
  ;[x, z] = [x * cosY + z * sinY, -x * sinY + z * cosY]

  const cosZ = Math.cos(rotation.z)
  const sinZ = Math.sin(rotation.z)
  ;[x, y] = [x * cosZ - y * sinZ, x * sinZ + y * cosZ]

  return [x, y, z]
}

function project(vertex, centerX, centerY, radius) {
  const camera = 4.2
  const depthScale = camera / (camera - vertex[2])
  return [
    centerX + vertex[0] * radius * depthScale,
    centerY - vertex[1] * radius * depthScale,
  ]
}

function drawDie(geometry, rotation, centerX, centerY, radius, label) {
  const transformed = geometry.vertices.map((vertex) => rotateVertex(vertex, rotation))
  const faces = geometry.faces
    .map((indices) => {
      const points3d = indices.map((index) => transformed[index])
      const center = points3d
        .reduce(add, [0, 0, 0])
        .map((value) => value / points3d.length)
      const normal = normalize(
        cross(
          subtract(points3d[1], points3d[0]),
          subtract(points3d[2], points3d[0]),
        ),
      )
      if (dot(normal, center) < 0) {
        normal[0] *= -1
        normal[1] *= -1
        normal[2] *= -1
      }

      return {
        center,
        normal,
        points: points3d.map((point) => project(point, centerX, centerY, radius)),
      }
    })
    .filter((face) => face.normal[2] > -0.08)
    .sort((left, right) => left.center[2] - right.center[2])

  const light = normalize([-0.45, 0.75, 1])

  faces.forEach((face) => {
    const brightness = Math.max(0, dot(face.normal, light))
    const lightness = 31 + brightness * 30

    context.beginPath()
    face.points.forEach(([x, y], index) => {
      if (index === 0) context.moveTo(x, y)
      else context.lineTo(x, y)
    })
    context.closePath()
    context.fillStyle = `hsl(266 48% ${lightness}%)`
    context.fill()
    context.strokeStyle = `rgba(229, 214, 255, ${0.14 + brightness * 0.18})`
    context.lineWidth = Math.max(1, radius * 0.011)
    context.stroke()
  })

  const labelFace = [...faces].sort(
    (left, right) => right.center[2] - left.center[2],
  )[0]
  if (!labelFace) return

  const [labelX, labelY] = project(labelFace.center, centerX, centerY, radius)
  const averageDistance =
    labelFace.points.reduce(
      (total, point) => total + Math.hypot(point[0] - labelX, point[1] - labelY),
      0,
    ) / labelFace.points.length
  const fontSize = Math.max(13, Math.min(radius * 0.34, averageDistance * 0.82))

  context.save()
  context.translate(labelX, labelY)
  context.fillStyle = 'rgba(255, 250, 255, 0.96)'
  context.font = `700 ${fontSize}px Rubik, system-ui, sans-serif`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.shadowColor = 'rgba(26, 11, 49, 0.55)'
  context.shadowBlur = radius * 0.08
  context.fillText(String(label), 0, fontSize * 0.03)
  context.restore()
}

function percentileLabels(value) {
  if (value === 100) return ['00', '0']
  const padded = String(value).padStart(2, '0')
  return [`${padded[0]}0`, padded[1]]
}

function draw() {
  if (!context || width === 0 || height === 0) return

  context.clearRect(0, 0, width, height)

  if (props.sides === 100) {
    const [tens, ones] = percentileLabels(props.value)
    const radius = Math.min(width * 0.24, height * 0.32)
    drawDie(geometries[10], rotations[0], width * 0.35, height * 0.49, radius, tens)
    drawDie(geometries[10], rotations[1], width * 0.66, height * 0.54, radius, ones)
    return
  }

  const radius = Math.min(width * 0.34, height * 0.38)
  drawDie(
    geometries[props.sides] || geometries[20],
    rotations[0],
    width / 2,
    height * 0.5,
    radius,
    props.value,
  )
}

function animate(timestamp) {
  const delta = Math.min(2, Math.max(0.5, (timestamp - lastTime) / 16.67 || 1))
  lastTime = timestamp

  rotations.forEach((rotation, index) => {
    if (props.rolling) {
      rotation.x += rotation.vx * delta
      rotation.y += rotation.vy * delta
      rotation.z += rotation.vz * delta
    } else {
      rotation.x += rotation.vx * delta
      rotation.y += rotation.vy * delta
      rotation.z += rotation.vz * delta
      rotation.vx *= 0.9
      rotation.vy *= 0.9
      rotation.vz *= 0.9

      if (Math.abs(rotation.vx) < 0.0002) rotation.vx = 0
      if (Math.abs(rotation.vy) < 0.0002) rotation.vy = 0
      if (Math.abs(rotation.vz) < 0.0002) rotation.vz = 0
    }

    if (index === 1 && props.sides !== 100) {
      rotation.vx = 0
      rotation.vy = 0
      rotation.vz = 0
    }
  })

  draw()
  animationFrame = window.requestAnimationFrame(animate)
}

function startRoll() {
  rotations.forEach((rotation, index) => {
    const direction = index === 0 ? 1 : -1
    rotation.vx = (0.085 + Math.random() * 0.045) * direction
    rotation.vy = (0.11 + Math.random() * 0.05) * (Math.random() > 0.5 ? 1 : -1)
    rotation.vz = (0.045 + Math.random() * 0.035) * direction
  })
}

function resizeCanvas() {
  if (!canvas.value) return

  const bounds = canvas.value.getBoundingClientRect()
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  width = bounds.width
  height = bounds.height
  canvas.value.width = Math.round(width * pixelRatio)
  canvas.value.height = Math.round(height * pixelRatio)
  context = canvas.value.getContext('2d')
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  draw()
}

watch(
  () => props.rolling,
  (isRolling) => {
    if (isRolling) startRoll()
  },
)

watch(
  () => props.sides,
  () => {
    rotations[0].x = -0.42
    rotations[0].y = 0.62
    rotations[0].z = 0.08
    draw()
  },
)

watch(() => props.value, draw)

onMounted(() => {
  resizeObserver = new ResizeObserver(resizeCanvas)
  resizeObserver.observe(canvas.value)
  resizeCanvas()
  animationFrame = window.requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (animationFrame) window.cancelAnimationFrame(animationFrame)
})
</script>

<style scoped>
.dice-visual {
  position: relative;
  width: 100%;
  aspect-ratio: 1.12;
  isolation: isolate;
}

canvas {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 1.6rem 1.4rem rgba(0, 0, 0, 0.44));
  transform: translateY(0);
  transition: filter 0.25s ease;
}

.ground-shadow {
  position: absolute;
  z-index: 0;
  width: 58%;
  height: 9%;
  bottom: 8%;
  left: 21%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.74);
  filter: blur(1rem);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.rolling canvas {
  filter: drop-shadow(0 2.5rem 1.7rem rgba(0, 0, 0, 0.34));
  animation: die-bounce 0.65s ease-in-out;
}

.rolling .ground-shadow {
  opacity: 0.55;
  transform: scale(0.72);
  animation: shadow-pulse 0.65s ease-in-out;
}

@keyframes die-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  38% { transform: translateY(-1.7rem) scale(0.94); }
  72% { transform: translateY(-0.35rem) scale(1.03); }
}

@keyframes shadow-pulse {
  0%, 100% { opacity: 0.72; transform: scale(1); }
  45% { opacity: 0.3; transform: scale(0.68); }
}

@media (prefers-reduced-motion: reduce) {
  canvas,
  .ground-shadow {
    animation: none !important;
    transition: none !important;
  }
}
</style>
