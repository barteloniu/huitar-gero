const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100)
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({antialias: true})
const pr = window.devicePixelRatio || 1

let geometry, material, mesh, shape

const init = () => {
    camera.position.z = 12

    renderer.setSize(window.innerWidth * pr, window.innerHeight * pr)
    renderer.domElement.style.width = window.innerWidth + "px"
    renderer.domElement.style.height = window.innerHeight + "px"
    document.body.appendChild(renderer.domElement)

    material = new THREE.MeshBasicMaterial({color: 0xffffff})
    shape = new THREE.Shape()
    shape.moveTo(0, -2)
    shape.lineTo(0, 0)
    shape.bezierCurveTo(0, 0, 0, 2, 2, 2)
    shape.lineTo(4, 2)
    shape.lineTo(4, 1)
    shape.lineTo(2, 1)
    shape.bezierCurveTo(2, 1, 1, 1, 1, 0)
    shape.lineTo(1, -2)

    //geometry = new THREE.ExtrudeGeometry(shape, {amount: 0.1, bevelEnabled: false})
    geometry = new Path([5, "r", 5, "r", 5, "r", 3, "r", 3, "r", 1, "r", 1, "r", 1]).geometry
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
}

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth * pr, window.innerHeight * pr)
    renderer.domElement.style.width = window.innerWidth + "px"
    renderer.domElement.style.height = window.innerHeight + "px"
    
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

const animate = () => {
    requestAnimationFrame(animate)

    //mesh.rotation.y += 0.01

    renderer.render(scene, camera)
}

init()
animate()