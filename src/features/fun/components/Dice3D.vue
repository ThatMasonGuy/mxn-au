<template>
  <div class="dice-visual" :class="{ rolling }">
    <div ref="mount" class="renderer-mount" aria-hidden="true"></div>
    <div class="ground-shadow" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Quaternion,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'

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

const emit = defineEmits(['settled'])
const mount = ref(null)

const PHI = (1 + Math.sqrt(5)) / 2
const EPSILON = 0.0001
const SPIN_DURATION = 900
const LAND_DURATION = 520
const LAND_NORMALS = [
  new Vector3(-0.1, 0.15, 0.984).normalize(),
  new Vector3(0.1, 0.15, 0.984).normalize(),
]

let renderer = null
let scene = null
let camera = null
let diceGroup = null
let resizeObserver = null
let animationFrame = null
let lastTimestamp = 0
let rollSequence = null
let dice = []

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const subtract = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const multiply = (vector, scalar) => vector.map((value) => value * scalar)
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

function centerOf(vertices) {
  return vertices
    .reduce(add, [0, 0, 0])
    .map((value) => value / vertices.length)
}

function normalizeVertices(vertices) {
  const center = centerOf(vertices)
  const centered = vertices.map((vertex) => subtract(vertex, center))
  const radius = Math.max(...centered.map(magnitude))
  return centered.map((vertex) => multiply(vertex, 1 / radius))
}

function orderFace(vertices, indices, normal, preferredUp = null) {
  const center = centerOf(indices.map((index) => vertices[index]))
  const references = [
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, 1],
  ]
  const preferredProjection = preferredUp
    ? subtract(preferredUp, multiply(normal, dot(preferredUp, normal)))
    : null
  const reference =
    preferredProjection && magnitude(preferredProjection) > EPSILON
      ? preferredUp
      : references
        .map((candidate) => ({
          candidate,
          alignment: Math.abs(dot(candidate, normal)),
        }))
        .sort((left, right) => left.alignment - right.alignment)[0].candidate
  const up = normalize(subtract(reference, multiply(normal, dot(reference, normal))))
  const right = normalize(cross(up, normal))

  let ordered = [...indices].sort((left, rightIndex) => {
    const leftVector = subtract(vertices[left], center)
    const rightVector = subtract(vertices[rightIndex], center)
    const leftAngle = Math.atan2(dot(leftVector, up), dot(leftVector, right))
    const rightAngle = Math.atan2(dot(rightVector, up), dot(rightVector, right))
    return leftAngle - rightAngle
  })

  const windingNormal = cross(
    subtract(vertices[ordered[1]], vertices[ordered[0]]),
    subtract(vertices[ordered[2]], vertices[ordered[0]]),
  )
  if (dot(windingNormal, normal) < 0) ordered = ordered.reverse()

  const topIndex = ordered
    .map((index, position) => ({
      position,
      height: dot(subtract(vertices[index], center), up),
    }))
    .sort((left, rightValue) => rightValue.height - left.height)[0].position

  ordered = [...ordered.slice(topIndex), ...ordered.slice(0, topIndex)]
  return { indices: ordered, center, normal, up }
}

function convexFaces(vertices, preferredUp = null) {
  const faceSets = new Map()

  for (let a = 0; a < vertices.length - 2; a += 1) {
    for (let b = a + 1; b < vertices.length - 1; b += 1) {
      for (let c = b + 1; c < vertices.length; c += 1) {
        const planeNormal = cross(
          subtract(vertices[b], vertices[a]),
          subtract(vertices[c], vertices[a]),
        )
        if (magnitude(planeNormal) < EPSILON) continue

        const distances = vertices.map((vertex) =>
          dot(planeNormal, subtract(vertex, vertices[a])),
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
    const center = centerOf(indices.map((index) => vertices[index]))
    let normal = normalize(
      cross(
        subtract(vertices[indices[1]], vertices[indices[0]]),
        subtract(vertices[indices[2]], vertices[indices[0]]),
      ),
    )
    if (dot(normal, center) < 0) normal = multiply(normal, -1)
    return orderFace(vertices, indices, normal, preferredUp)
  })
}

function dualOf(vertices, faces) {
  const center = centerOf(vertices)
  const dualVertices = faces.map((indices) => {
    let normal = normalize(
      cross(
        subtract(vertices[indices[1]], vertices[indices[0]]),
        subtract(vertices[indices[2]], vertices[indices[0]]),
      ),
    )
    const faceCenter = centerOf(indices.map((index) => vertices[index]))
    if (dot(normal, subtract(faceCenter, center)) < 0) normal = multiply(normal, -1)
    const distance = dot(normal, subtract(vertices[indices[0]], center))
    return multiply(normal, 1 / distance)
  })

  return makePolyhedron(dualVertices)
}

function makePolyhedron(rawVertices, preferredUp = null) {
  const vertices = normalizeVertices(rawVertices)
  return {
    vertices,
    faces: convexFaces(vertices, preferredUp),
  }
}

function ringVertices(count, z, rotation = 0) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count + rotation
    return [Math.cos(angle), Math.sin(angle), z]
  })
}

function makeD10() {
  const top = ringVertices(5, 0.5)
  const bottom = ringVertices(5, -0.5, Math.PI / 5)
  const vertices = [...top, ...bottom]
  const faces = [
    [0, 1, 2, 3, 4],
    [9, 8, 7, 6, 5],
  ]

  for (let index = 0; index < 5; index += 1) {
    const next = (index + 1) % 5
    const previous = (index + 4) % 5
    faces.push([index, 5 + index, 5 + previous])
    faces.push([5 + index, index, next])
  }

  const trapezohedron = dualOf(vertices, faces)

  // A face-transitive pentagonal trapezohedron is extremely narrow through
  // its equator. Widening it radially keeps every kite planar while matching
  // the familiar proportions of a physical d10.
  return makePolyhedron(
    trapezohedron.vertices.map(([x, y, z]) => [x * 1.62, y * 1.62, z]),
    [0, 0, 1],
  )
}

const POLYHEDRA = {
  4: makePolyhedron([
    [1, 1, 1],
    [-1, -1, 1],
    [-1, 1, -1],
    [1, -1, -1],
  ]),
  6: makePolyhedron([
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
  ]),
  8: makePolyhedron([
    [1, 0, 0], [-1, 0, 0],
    [0, 1, 0], [0, -1, 0],
    [0, 0, 1], [0, 0, -1],
  ]),
  10: makeD10(),
  12: makePolyhedron([
    [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1],
    [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1],
    [0, -1 / PHI, -PHI], [0, -1 / PHI, PHI],
    [0, 1 / PHI, -PHI], [0, 1 / PHI, PHI],
    [-1 / PHI, -PHI, 0], [-1 / PHI, PHI, 0],
    [1 / PHI, -PHI, 0], [1 / PHI, PHI, 0],
    [-PHI, 0, -1 / PHI], [PHI, 0, -1 / PHI],
    [-PHI, 0, 1 / PHI], [PHI, 0, 1 / PHI],
  ]),
  20: makePolyhedron([
    [0, -1, -PHI], [0, -1, PHI], [0, 1, -PHI], [0, 1, PHI],
    [-1, -PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [1, PHI, 0],
    [-PHI, 0, -1], [PHI, 0, -1], [-PHI, 0, 1], [PHI, 0, 1],
  ]),
}

function createFaceTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 384
  canvas.height = 384
  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(118, 86, 12, 192, 192, 260)

  gradient.addColorStop(0, '#a987e1')
  gradient.addColorStop(0.5, '#7650b5')
  gradient.addColorStop(1, '#43276d')
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = Math.min(renderer?.capabilities.getMaxAnisotropy() || 1, 8)
  return texture
}

function createLabelTexture(label, faceCount) {
  const canvas = document.createElement('canvas')
  canvas.width = 384
  canvas.height = 384
  const context = canvas.getContext('2d')
  const text = String(label)
  const baseSize = text.length >= 3 ? 130 : text.length === 2 ? 160 : 205
  const faceScale = faceCount >= 20 ? 0.82 : faceCount >= 12 ? 0.9 : 0.95
  const fontSize = Math.round(baseSize * faceScale)

  context.fillStyle = '#fbf8ff'
  context.font = `700 ${fontSize}px Rubik, Arial, sans-serif`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.shadowColor = 'rgba(25, 10, 48, 0.55)'
  context.shadowBlur = 14
  context.shadowOffsetY = 5
  context.fillText(text, 192, 192)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = Math.min(renderer?.capabilities.getMaxAnisotropy() || 1, 8)
  return texture
}

function buildGeometry(polyhedron) {
  const geometry = new BufferGeometry()
  const positions = []
  const uvs = []
  let triangleOffset = 0

  polyhedron.faces.forEach((face) => {
    const vertexCount = face.indices.length
    const faceUvs = face.indices.map((_, index) => {
      const angle = Math.PI / 2 + (Math.PI * 2 * index) / vertexCount
      return [0.5 + Math.cos(angle) * 0.46, 0.5 + Math.sin(angle) * 0.46]
    })
    const triangleCount = vertexCount - 2

    for (let index = 1; index < vertexCount - 1; index += 1) {
      const triangle = [0, index, index + 1]
      triangle.forEach((faceVertex) => {
        const vertex = polyhedron.vertices[face.indices[faceVertex]]
        positions.push(...vertex)
        uvs.push(...faceUvs[faceVertex])
      })
    }

    geometry.addGroup(triangleOffset * 3, triangleCount * 3, 0)
    triangleOffset += triangleCount
  })

  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2))
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

function faceInsetRadius(polyhedron, face) {
  return face.indices.reduce((closest, index, position) => {
    const nextIndex = face.indices[(position + 1) % face.indices.length]
    const edge = subtract(
      polyhedron.vertices[nextIndex],
      polyhedron.vertices[index],
    )
    const toCenter = subtract(face.center, polyhedron.vertices[index])
    const distance = magnitude(cross(edge, toCenter)) / magnitude(edge)
    return Math.min(closest, distance)
  }, Number.POSITIVE_INFINITY)
}

function createFaceLabel(polyhedron, face, label, faceCount) {
  const normal = normalize(face.normal)
  const up = normalize(face.up)
  const right = normalize(cross(up, normal))
  const insetRadius = faceInsetRadius(polyhedron, face)
  const sizeScale =
    faceCount >= 20 ? 1.85 :
    faceCount >= 12 ? 1.8 :
    faceCount >= 10 ? 2 : 1.75
  const halfSize = insetRadius * sizeScale * 0.5
  const offsetCenter = add(face.center, multiply(normal, 0.008))
  const bottomLeft = subtract(
    subtract(offsetCenter, multiply(right, halfSize)),
    multiply(up, halfSize),
  )
  const bottomRight = add(
    subtract(offsetCenter, multiply(up, halfSize)),
    multiply(right, halfSize),
  )
  const topRight = add(
    add(offsetCenter, multiply(right, halfSize)),
    multiply(up, halfSize),
  )
  const topLeft = add(
    subtract(offsetCenter, multiply(right, halfSize)),
    multiply(up, halfSize),
  )
  const geometry = new BufferGeometry()

  geometry.setAttribute(
    'position',
    new BufferAttribute(
      new Float32Array([
        ...bottomLeft, ...bottomRight, ...topRight,
        ...bottomLeft, ...topRight, ...topLeft,
      ]),
      3,
    ),
  )
  geometry.setAttribute(
    'uv',
    new BufferAttribute(
      new Float32Array([
        0, 0, 1, 0, 1, 1,
        0, 0, 1, 1, 0, 1,
      ]),
      2,
    ),
  )
  geometry.computeVertexNormals()

  const material = new MeshBasicMaterial({
    map: createLabelTexture(label, faceCount),
    transparent: true,
    alphaTest: 0.02,
    depthWrite: false,
    toneMapped: false,
  })
  const labelMesh = new Mesh(geometry, material)
  labelMesh.renderOrder = 2
  return labelMesh
}

function createNumberedDie(polyhedron, labels) {
  const geometry = buildGeometry(polyhedron)
  const material = new MeshStandardMaterial({
    map: createFaceTexture(),
    color: new Color('#ffffff'),
    roughness: 0.34,
    metalness: 0.08,
  })
  const mesh = new Mesh(geometry, material)
  const edges = new LineSegments(
    new EdgesGeometry(geometry, 12),
    new LineBasicMaterial({
      color: '#d9c4f7',
      transparent: true,
      opacity: 0.32,
    }),
  )

  mesh.add(edges)
  polyhedron.faces.forEach((face, index) => {
    mesh.add(createFaceLabel(polyhedron, face, labels[index], labels.length))
  })
  mesh.userData.faces = polyhedron.faces.map((face, index) => ({
    ...face,
    label: String(labels[index]),
  }))
  mesh.userData.velocity = new Vector3()
  mesh.userData.basePosition = new Vector3()
  return mesh
}

function disposeDie(mesh) {
  mesh.geometry.dispose()
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
  materials.forEach((material) => {
    material.map?.dispose()
    material.dispose()
  })
  mesh.children.forEach((child) => {
    child.geometry?.dispose()
    child.material?.dispose()
  })
}

function singleLabels(sides) {
  return Array.from({ length: sides }, (_, index) => index + 1)
}

function rebuildDice() {
  if (!diceGroup) return

  dice.forEach((mesh) => {
    diceGroup.remove(mesh)
    disposeDie(mesh)
  })
  dice = []
  rollSequence = null

  if (props.sides === 100) {
    const tens = createNumberedDie(
      POLYHEDRA[10],
      ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'],
    )
    const ones = createNumberedDie(
      POLYHEDRA[10],
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    )

    tens.scale.setScalar(0.96)
    ones.scale.setScalar(0.96)
    tens.position.set(-0.94, 0, 0)
    ones.position.set(0.94, 0, 0)
    tens.userData.basePosition.copy(tens.position)
    ones.userData.basePosition.copy(ones.position)
    dice.push(tens, ones)
  } else {
    const mesh = createNumberedDie(POLYHEDRA[props.sides], singleLabels(props.sides))
    mesh.scale.setScalar(1.48)
    mesh.userData.basePosition.copy(mesh.position)
    dice.push(mesh)
  }

  dice.forEach((mesh) => diceGroup.add(mesh))
  settleImmediately()
}

function resultLabels() {
  if (props.sides !== 100) return [String(props.value)]
  if (props.value === 100) return ['00', '0']

  const padded = String(props.value).padStart(2, '0')
  return [`${padded[0]}0`, padded[1]]
}

function targetQuaternion(mesh, dieIndex, label) {
  const face =
    mesh.userData.faces.find((candidate) => candidate.label === String(label)) ||
    mesh.userData.faces[0]
  const localNormal = new Vector3(...face.normal).normalize()
  const localUp = new Vector3(...face.up).normalize()
  const localRight = new Vector3().crossVectors(localUp, localNormal).normalize()
  const localBasis = new Matrix4().makeBasis(localRight, localUp, localNormal)

  const targetNormal = LAND_NORMALS[dieIndex] || LAND_NORMALS[0]
  const targetUp = new Vector3(0, 1, 0)
    .addScaledVector(targetNormal, -targetNormal.y)
    .normalize()
  const targetRight = new Vector3().crossVectors(targetUp, targetNormal).normalize()
  const targetBasis = new Matrix4().makeBasis(targetRight, targetUp, targetNormal)
  const rotationMatrix = targetBasis.multiply(localBasis.invert())

  return new Quaternion().setFromRotationMatrix(rotationMatrix).normalize()
}

function settleImmediately() {
  if (!dice.length) return
  const labels = resultLabels()

  dice.forEach((mesh, index) => {
    mesh.quaternion.copy(targetQuaternion(mesh, index, labels[index] || labels[0]))
    mesh.position.copy(mesh.userData.basePosition)
  })
}

function startRoll() {
  if (!dice.length) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducedMotion) {
    settleImmediately()
    window.setTimeout(() => emit('settled'), 30)
    return
  }

  dice.forEach((mesh, index) => {
    const direction = index === 0 ? 1 : -1
    mesh.userData.velocity.set(
      (2.9 + Math.random() * 1.3) * direction,
      (3.7 + Math.random() * 1.5) * (Math.random() > 0.5 ? 1 : -1),
      (2.2 + Math.random()) * direction,
    )
  })

  rollSequence = {
    phase: 'spin',
    startedAt: performance.now(),
    landingStartedAt: 0,
    starts: [],
    targets: [],
  }
}

function beginLanding(timestamp) {
  const labels = resultLabels()
  rollSequence.phase = 'landing'
  rollSequence.landingStartedAt = timestamp
  rollSequence.starts = dice.map((mesh) => mesh.quaternion.clone())
  rollSequence.targets = dice.map((mesh, index) =>
    targetQuaternion(mesh, index, labels[index] || labels[0]),
  )
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3)
}

function updateRoll(timestamp, deltaSeconds) {
  if (!rollSequence) return

  if (rollSequence.phase === 'spin') {
    const elapsed = timestamp - rollSequence.startedAt
    dice.forEach((mesh, index) => {
      const velocity = mesh.userData.velocity
      mesh.rotateOnWorldAxis(new Vector3(1, 0, 0), velocity.x * deltaSeconds)
      mesh.rotateOnWorldAxis(new Vector3(0, 1, 0), velocity.y * deltaSeconds)
      mesh.rotateOnWorldAxis(new Vector3(0, 0, 1), velocity.z * deltaSeconds)

      const progress = Math.min(1, elapsed / SPIN_DURATION)
      const lift = Math.sin(progress * Math.PI) * (index === 0 ? 0.72 : 0.58)
      mesh.position.copy(mesh.userData.basePosition)
      mesh.position.y += lift
      mesh.position.x += Math.sin(progress * Math.PI * 2 + index) * 0.14
    })

    if (elapsed >= SPIN_DURATION) beginLanding(timestamp)
    return
  }

  const progress = Math.min(
    1,
    (timestamp - rollSequence.landingStartedAt) / LAND_DURATION,
  )
  const eased = easeOutCubic(progress)

  dice.forEach((mesh, index) => {
    mesh.quaternion.slerpQuaternions(
      rollSequence.starts[index],
      rollSequence.targets[index],
      eased,
    )
    mesh.position.copy(mesh.userData.basePosition)
    mesh.position.y += Math.abs(Math.sin(progress * Math.PI * 2.4)) * (1 - progress) * 0.2
  })

  if (progress >= 1) {
    dice.forEach((mesh, index) => {
      mesh.quaternion.copy(rollSequence.targets[index])
      mesh.position.copy(mesh.userData.basePosition)
    })
    rollSequence = null
    emit('settled')
  }
}

function resizeRenderer() {
  if (!renderer || !mount.value) return
  const bounds = mount.value.getBoundingClientRect()
  if (!bounds.width || !bounds.height) return

  renderer.setSize(bounds.width, bounds.height, false)
  camera.aspect = bounds.width / bounds.height
  camera.updateProjectionMatrix()
}

function animate(timestamp) {
  const deltaSeconds = Math.min(
    0.034,
    Math.max(0.008, (timestamp - lastTimestamp) / 1000 || 0.016),
  )
  lastTimestamp = timestamp

  updateRoll(timestamp, deltaSeconds)
  renderer.render(scene, camera)
  animationFrame = window.requestAnimationFrame(animate)
}

function setupScene() {
  scene = new Scene()
  camera = new PerspectiveCamera(32, 1, 0.1, 100)
  camera.position.set(0, 0, 7)

  renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.setClearColor(0x000000, 0)
  mount.value.appendChild(renderer.domElement)

  scene.add(new AmbientLight('#d9c9ef', 1.7))

  const keyLight = new DirectionalLight('#fff4ff', 3.2)
  keyLight.position.set(-3, 4, 6)
  scene.add(keyLight)

  const rimLight = new DirectionalLight('#7c4dc0', 2.4)
  rimLight.position.set(4, -2, 3)
  scene.add(rimLight)

  diceGroup = new Group()
  scene.add(diceGroup)
}

watch(
  () => props.sides,
  rebuildDice,
)

watch(
  () => props.rolling,
  (isRolling) => {
    if (isRolling) startRoll()
  },
)

watch(
  () => props.value,
  () => {
    if (!props.rolling && !rollSequence) settleImmediately()
  },
)

onMounted(() => {
  setupScene()
  resizeObserver = new ResizeObserver(resizeRenderer)
  resizeObserver.observe(mount.value)
  resizeRenderer()
  rebuildDice()
  animationFrame = window.requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (animationFrame) window.cancelAnimationFrame(animationFrame)
  dice.forEach(disposeDie)
  renderer?.dispose()
  renderer?.domElement.remove()
})
</script>

<style scoped>
.dice-visual {
  position: relative;
  width: 100%;
  aspect-ratio: 1.12;
  isolation: isolate;
}

.renderer-mount {
  position: absolute;
  z-index: 1;
  inset: 0;
  filter: drop-shadow(0 1.5rem 1.35rem rgba(0, 0, 0, 0.42));
}

.renderer-mount :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.ground-shadow {
  position: absolute;
  z-index: 0;
  width: 58%;
  height: 9%;
  bottom: 8%;
  left: 21%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.72);
  filter: blur(1rem);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.rolling .ground-shadow {
  opacity: 0.48;
  transform: scale(0.76);
  animation: shadow-pulse 1.42s ease-in-out;
}

@keyframes shadow-pulse {
  0%, 100% { opacity: 0.72; transform: scale(1); }
  48% { opacity: 0.28; transform: scale(0.66); }
}

@media (prefers-reduced-motion: reduce) {
  .ground-shadow {
    animation: none !important;
    transition: none !important;
  }
}
</style>
