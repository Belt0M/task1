import * as dat from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js'

const params = {
	u: 1,
	v: 1,
	color: 0xffffff,
	wireframe: false,
}
const segments = 10

//Init renderer, scene and camera
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
camera.position.set(5, 5, 5)

//Add all needed helpers
const controls = new OrbitControls(camera, renderer.domElement)
const axesHelper = new THREE.AxesHelper(5)
const gridHelper = new THREE.GridHelper(10)

scene.add(axesHelper, gridHelper)

//Parametric function from the condition of the test task
function parametricFunction(u, v, target) {
	const newU = u * params.u
	const newV = v * params.v
	const x = newU * Math.sin(newV)
	const y = newU * Math.cos(newV)
	const z = newV * Math.cos(newU)
	target.set(x, y, z)
}

function generateSurface() {
	return new ParametricGeometry(parametricFunction, segments, segments)
}

//Add surface based on param. func.
const surfaceGeometry = generateSurface(params.u, params.v)
const surfaceMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	wireframe: false,
	side: THREE.DoubleSide,
})
const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial)
scene.add(surface)

//Controllers

const gui = new dat.GUI()
gui.addColor(params, 'color').onChange(e => surface.material.color.set(e))
gui.add(params, 'wireframe').onChange(e => (surface.material.wireframe = e))
gui.add(params, 'u', 0, 2 * Math.PI).onChange(updateSurface)
gui.add(params, 'v', 0, 2 * Math.PI).onChange(updateSurface)

function updateSurface() {
	const newSurface = generateSurface(params.u, params.v)
	surface.geometry.dispose()
	surface.geometry = newSurface
}

//Animation loop render
function animate() {
	renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
