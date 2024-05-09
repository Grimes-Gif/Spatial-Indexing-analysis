class Vector {

    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.mag = Math.sqrt(this.x^2 + this.y^2)
    }

    scale(value) {
        return new Vector(this.x*value, this.y*value)
    }

    add(vec) {
        return new Vector(this.x+vec.x, this.y+vec.y)
    }

    norm() {
        return new Vector(this.x/this.mag, this.y/this.mag)
    }

}

class point {

    constructor(pos) {
        this.pos = pos
        this.speed = .5
        let angle = (Math.random() * Math.PI * 2.0) - Math.PI; //compute random angle
        this.direction = new Vector(Math.cos(angle), Math.sin(angle)) //get unit vector
        this.diameter = 10
        this.isSelected = false
    }

    update() { 
        //scale unit vector by speed and add to position
        this.pos = this.pos.add(this.direction.scale(this.speed))
    }

    draw() {
        if (this.isSelected) {
            stroke('blue')
            fill(color('blue'))
        } else {
            stroke('green')
            fill(color('green'))
        }
        circle(this.pos.x, this.pos.y, this.diameter)
    }

    isColliding(p) {
        if (this.diameter + p.diameter <= sqrt((this.x - p.x)**2 + (this.y - p.y)**2)) {
            return true
        }
        
        return false
    }
}


class AABB {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    cellUL() {
        return new AABB(this.x, this.y, this.w/2, this.h/2)
    }

    cellUR() {
        return new AABB(this.x + this.w/2, this.y, this.w/2, this.h/2)
    }

    cellBL() {
        return new AABB(this.x, this.y + this.h/2, this.w/2, this.h/2)
    }

    cellBR() {
        return new AABB(this.x + this.w/2, this.y + this.h/2, 
            this.w/2, this.h/2)
    }

    containsPoint(point) {
        if (point.pos.x > this.x && point.pos.x < this.x + this.w) {
            if (point.pos.y > this.y && point.pos.y < this.y + this.h) {
                return true
            }
        }
        return false
    }

    containsAABB(aabb) {
        if (this.x < aabb.x + aabb.w && aabb.x < this.x + this.w) { //check for horizontal overlap
            if (this.y < aabb.y + aabb.h && aabb.y < this.y + this.h) { //check for vertical overlap
                return true
            }
        }

        return false
    }

    draw(color) {
        stroke(color)
        noFill()
        rect(this.x, this.y, this.w, this.h)
    }
}