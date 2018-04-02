class WorldPath{
    constructor(map){
        let segments = []
        let cut = 0
        let pos = [0, 0]
        let rot = 0
        let height = 0
        for(const i in map){
            if(map[i] === "u" || map[i] === "d"){
                let s = new WorldPathSegment(map.slice(cut, i), pos, rot, height)
                segments.push(s)
                cut = +i + 1
                if(map[i] === "d") height -= 2
                else height += 2
                pos = s.endPos
                rot = s.endRot
            }
        }
        let s = new WorldPathSegment(map.slice(cut), pos, rot, height)
        segments.push(s)
        pos = s.endPos
        rot = s.endRot
        this.segments = segments
    }
}

class PlayerPath{
    constructor(map){
        let segments = []
        let cut = 0
        let pos = [0.5, 0]
        let rot = 0
        let height = 0
        for(const i in map){
            if(map[i] === "u" || map[i] === "d"){
                let s = new PlayerPathSegment(map.slice(cut, i), pos, rot, height)
                segments.push(s)
                cut = +i + 1
                if(map[i] === "d") height -= 2
                else height += 2
                pos = s.endPos
                rot = s.endRot
            }
        }
        let s = new PlayerPathSegment(map.slice(cut), pos, rot, height)
        segments.push(s)
        pos = s.endPos
        rot = s.endRot
        this.segments = segments
    }
}

class WorldPathSegment{
    constructor(map, pos, rot, height){
        this.height = height
        map = map.slice()
        let shape = new THREE.Shape()
        let sin, cos
        shape.moveTo(pos[0], pos[1])
        for(const i of map){
            sin = Math.sin(rot / 180 * Math.PI)
            cos = Math.cos(rot / 180 * Math.PI)
            if(!isNaN(i)){
                pos[0] += i * sin
                pos[1] += i * cos
                shape.lineTo(pos[0], pos[1])
            }
            else if(i === "r"){
                let orient = [2, -2] //sin == 1
                if (sin === -1) orient = [-2, 2]
                else if(cos === 1) orient = [2, 2]
                else if(cos === -1) orient = [-2, -2]
                shape.bezierCurveTo(pos[0], pos[1], pos[0] + 2 * sin, pos[1] + 2 * cos, pos[0] + orient[0], pos[1] + orient[1])
                pos[0] += orient[0]
                pos[1] += orient[1]
                rot += 90
            }
            else if(i === "l"){
                let orient = [1, 1] //sin == 1
                if (sin === -1) orient = [-1, -1]
                else if(cos === 1) orient = [-1, 1]
                else if(cos === -1) orient = [1, -1]
                shape.bezierCurveTo(pos[0], pos[1], pos[0] + sin, pos[1] + cos, pos[0] + orient[0], pos[1] + orient[1])
                pos[0] += orient[0]
                pos[1] += orient[1]
                rot -= 90
            }
        }
        this.endPos = pos.slice()
        this.endRot = rot

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
            else if(i === "r"){
                let orient = [-1, -1] //sin == 1
                if (sin === -1) orient = [1, 1]
                else if(cos === 1) orient = [1, -1]
                else if(cos === -1) orient = [-1, 1]
                shape.bezierCurveTo(pos[0], pos[1], pos[0] - sin, pos[1] - cos, pos[0] + orient[0], pos[1] + orient[1])
                pos[0] += orient[0]
                pos[1] += orient[1]
                rot -= 90
            }
            else if(i === "l"){
                let orient = [-2, 2] //sin == 1
                if (sin === -1) orient = [2, -2]
                else if(cos === 1) orient = [-2, -2]
                else if(cos === -1) orient = [2, 2]
                shape.bezierCurveTo(pos[0], pos[1], pos[0] - 2 * sin, pos[1] - 2 * cos, pos[0] + orient[0], pos[1] + orient[1])
                pos[0] += orient[0]
                pos[1] += orient[1]
                rot += 90
            } 
        }
        
        this.geometry = new THREE.ExtrudeBufferGeometry(shape, {amount: 0.2, bevelEnabled: false, curveSegments: 24})
    }
}

class PlayerPathSegment{
    constructor(map, pos, rot, height){
        this.height = height
        let curves = []
        let holograms = []
        let sin, cos
        for(const i of map){
            sin = Math.sin(rot / 180 * Math.PI)
            cos = Math.cos(rot / 180 * Math.PI)
            if(!isNaN(i)){
                let oldPos = pos.slice()
                pos[0] += i * sin
                pos[1] += i * cos
                curves.push(new THREE.LineCurve(new THREE.Vector2(oldPos[0], oldPos[1]), new THREE.Vector2(pos[0], pos[1])))
            }
            else if(i === "r"){
                holograms.push([pos.slice(), "r"])
                let orient = [1.5, -1.5] //sin == 1
                if (sin === -1) orient = [-1.5, 1.5]
                else if(cos === 1) orient = [1.5, 1.5]
                else if(cos === -1) orient = [-1.5, -1.5]
                curves.push(new THREE.QuadraticBezierCurve(new THREE.Vector2(pos[0], pos[1]), new THREE.Vector2(pos[0] + 1.5 * sin, pos[1] + 1.5 * cos), new THREE.Vector2(pos[0] + orient[0], pos[1] + orient[1])))
                pos[0] += orient[0]
                pos[1] += orient[1]
                rot += 90
            }
            else if(i === "l"){
                holograms.push([pos.slice(), "l"])
                let orient = [1.5, 1.5] //sin == 1
                if (sin === -1) orient = [-1.5, -1.5]
                else if(cos === 1) orient = [-1.5, 1.5]
                else if(cos === -1) orient = [1.5, -1.5]
                curves.push(new THREE.QuadraticBezierCurve(new THREE.Vector2(pos[0], pos[1]), new THREE.Vector2(pos[0] + 1.5 * sin, pos[1] + 1.5 * cos), new THREE.Vector2(pos[0] + orient[0], pos[1] + orient[1])))
                pos[0] += orient[0]
                pos[1] += orient[1]
                rot -= 90
            }
        }
        this.endPos = pos
        this.endRot = rot
        this.curves = curves
        this.holograms = holograms
    }
}