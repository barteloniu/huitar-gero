class Path{
    constructor(map){
        let shape = new THREE.Shape()
        let rot = 0
        let pos = [0, 0]
        let sin, cos
        for(const i of map){
            sin = Math.sin(rot / 180 * Math.PI)
            cos = Math.cos(rot / 180 * Math.PI)
            if(!isNaN(i)){
                pos[0] += i * sin
                pos[1] += i * cos
                shape.lineTo(pos[0], pos[1])
            }
            else if(i == "r"){
                let orient = [2, -2] //sin == 1
                if (sin == -1) orient = [-2, 2]
                else if(cos == 1) orient = [2, 2]
                else if(cos == -1) orient = [-2, -2]
                shape.bezierCurveTo(pos[0], pos[1], pos[0] + 2 * sin, pos[1] + 2 * cos, pos[0] + orient[0], pos[1] + orient[1])
                pos[0] += orient[0]
                pos[1] += orient[1]
                rot += 90
            }
        }
        map.reverse()
        sin = Math.sin(rot / 180 * Math.PI)
        cos = Math.cos(rot / 180 * Math.PI)
        pos[0] += cos
        pos[1] -= sin
        shape.lineTo(pos[0], pos[1])
        
        for(const i of map){
            sin = Math.sin(rot / 180 * Math.PI)
            cos = Math.cos(rot / 180 * Math.PI)
            if(!isNaN(i)){
                pos[0] -= i * sin
                pos[1] -= i * cos
                shape.lineTo(pos[0], pos[1])
            }
            else if(i == "r"){
                console.log(cos, sin)
                let orient = [-1, -1] //sin == 1
                if (sin == -1) orient = [1, 1]
                else if(cos == 1) orient = [1, -1]
                else if(cos == -1) orient = [-1, 1]
                shape.bezierCurveTo(pos[0], pos[1], pos[0] - sin, pos[1] - cos, pos[0] + orient[0], pos[1] + orient[1])
                pos[0] += orient[0]
                pos[1] += orient[1]
                rot -= 90
                
            }
        }
        
        this.geometry = new THREE.ExtrudeGeometry(shape, {amount: 0.1, bevelEnabled: false})
    }
}