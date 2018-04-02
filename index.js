const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100)
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({antialias: true})
//const controls = new THREE.OrbitControls(camera, renderer.domElement)
const ambient = new THREE.AmbientLight(0x5e6380)
const sun = new THREE.DirectionalLight(0x282a36, 4)
const pr = window.devicePixelRatio || 1
const pathDescription = [10, "r", "l", "r", "l", "r", "l", "r", "l", "r", "r", "r", "l", 2, "u", 3, "l", 2, "d", 3, "l", 2, "d", 2, "r", "l"] //[1, "r", "r", 1, "r", "l", "l", 3, "l", 5, "l", "r", "r", 2]
const ham = new Hammer(renderer.domElement)

const player = {
    object: null,
    path: {
        progress: 0,
        heightChange: [],
        points: []
    }
}


const init = () => {
    scene.background = new THREE.Color(0x282a36)

    //renderer.shadowMap.enabled = true
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap

    sun.position.set(0, 0, 1)
    /*
    sun.castShadow = true
    sun.shadow.mapSize.width = 256
    sun.shadow.mapSize.height = 256
    sun.shadow.camera.far = 1
    */
    //sun.shadow.camera.top = 25
    //sun.shadow.camera.left = -25
    //sun.shadow.camera.right = 25
    //sun.shadow.camera.bottom = -25
    scene.add(sun)
    scene.add(ambient)

    camera.position.z = 2.5
    camera.position.y = -3
    camera.rotation.x = THREE.Math.degToRad(70)

    renderer.setSize(window.innerWidth * pr, window.innerHeight * pr)
    renderer.domElement.style.width = window.innerWidth + "px"
    renderer.domElement.style.height = window.innerHeight + "px"
    document.body.appendChild(renderer.domElement)

    let pathMaterial = new THREE.MeshStandardMaterial({color: 0xf8f8f2})

    let w = new WorldPath(pathDescription)
    for(const s of w.segments){
        let mesh = new THREE.Mesh(s.geometry, pathMaterial)
        mesh.position.z = s.height
        scene.add(mesh)
    }

    let pPath = new PlayerPath(pathDescription)
    for(const s of pPath.segments){
        player.path.heightChange[player.path.points.length] = s.height
        for(const c of s.curves){
            player.path.points = player.path.points.concat(c.getSpacedPoints(10 * c.getLength()))
            player.path.points.pop()
        }
        for(const h of s.holograms){
            let mesh = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.4, 0.4, 0.1, 24),
                new THREE.MeshBasicMaterial({color: 0x8be9fd, transparent: true, opacity: 0.7}))
            if(h[1] === "l") mesh.material.color = new THREE.Color(0xffb86c)
            mesh.rotation.x = THREE.Math.degToRad(90)
            mesh.position.set(h[0][0], h[0][1], s.height + 0.25)
            scene.add(mesh)
        }
    }

    player.object = new THREE.Mesh(new THREE.TorusBufferGeometry(0.3, 0.1, 12, 32), new THREE.MeshLambertMaterial({color: 0x50fa7b}))
    //player.object.castShadow = true
    player.object.add(camera)
    scene.add(player.object)

    ham.get("swipe").set({direction: Hammer.DIRECTION_ALL})

    /*
    let rect = new THREE.RectAreaLight(0xbd93f9, 20, 1, 1)
    let rectM = new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial({color: 0xbd93f9}))
    rect.add(rectM)
    rect.position.set(0.5, 0.5, 1)
    rect.rotation.x = Math.PI / 0.8
    scene.add(rect)
    */

    /*
    sl = new THREE.SpotLight("tomato", 1, 40, 0.01, 0, 0)
    sl.position.set(0.5, 0.5, 40)
    let target = new THREE.Object3D()
    target.position.set(0.5, 0.5, 0)
    scene.add(target)
    sl.target = target
    slh = new THREE.SpotLightHelper(sl)
    scene.add(sl)
    scene.add(slh)
    */

    //controls.target = player.object.position

    //ch = new THREE.CameraHelper(sun.shadow.camera)
    //scene.add(ch)
}

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth * pr, window.innerHeight * pr)
    renderer.domElement.style.width = window.innerWidth + "px"
    renderer.domElement.style.height = window.innerHeight + "px"
    
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

ham.on("swipeup swipeleft swiperight swipedown tap", e => {
    //for now this function is only to prevent scrolling in chromium
})

const animate = () => {
    requestAnimationFrame(animate)

    if(player.path.heightChange[player.path.progress] !== undefined){
        player.object.position.z = player.path.heightChange[player.path.progress] + 0.3
    }
    player.object.position.x = player.path.points[player.path.progress].x
    player.object.position.y = player.path.points[player.path.progress].y
    player.path.progress++
    if(player.path.progress === player.path.points.length) player.path.progress = 0

    if(player.path.progress !== 0){
        let x = player.path.points[player.path.progress].x - player.path.points[player.path.progress - 1].x
        let y = player.path.points[player.path.progress].y - player.path.points[player.path.progress - 1].y
        player.object.rotation.z = Math.atan2(y, x) - Math.PI / 2
    }

    //slh.update()

    //sun.shadow.camera.top = player.object.position.y + 1
    //sun.shadow.camera.left = player.object.position.x - 1
    //sun.shadow.camera.right = player.object.position.x + 1
    //sun.shadow.camera.bottom = player.object.position.y - 1
    //camera.target = player.object
    //sun.shadow.camera.updateProjectionMatrix()
    //ch.update()

    renderer.render(scene, camera)
}

init()
animate()