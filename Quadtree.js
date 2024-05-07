class point {

    constructor(x,y) {
        this.x = x
        this.y = y
        this.speed = .1
        let angle = (Math.random() * Math.PI * 2.0) - Math.PI; //compute random angle
        this.direction = [Math.cos(angle), Math.sin(angle)] //get unit vector
        this.diameter = 10
        this.isSelected = false
    }

    update() { 
        //scale unit vector by speed and add to position
        this.x += this.speed*this.direction[0]
        this.y += this.speed*this.direction[1]
    }

    draw() {
        if (this.isSelected) {
            stroke('blue')
            fill(color('blue'))
        } else {
            stroke('green')
            fill(color('green'))
        }
        circle(this.x, this.y, this.diameter)
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
        if (point.x > this.x && point.x < this.x + this.w) {
            if (point.y > this.y && point.y < this.y + this.h) {
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

//pointer enforced
class QTree {

    constructor(AABB, tolerance) {
        this.AABB = AABB
        this.tolerance = tolerance
        this.points = []
    }

    insert(point) {
        
        //check if point is in bounds of this cell, if not check another cell
        if (!this.AABB.containsPoint(point)) {
            return
        }

        //if we can add a point to the current cell, do so
        if (this.upLeft == null && this.points.length < this.tolerance) {
            this.points.push(point)
            return point
        } else { //else we subdivide and continue on
            if (this.upLeft == null) {
                this.subdivide(this.points)
            }

            this.upLeft.insert(point)
            this.upRight.insert(point)
            this.botLeft.insert(point)
            this.botRight.insert(point)
        }

        return point
    }
    
    subdivide(point_list) {
        this.upLeft = new QTree(this.AABB.cellUL(), this.tolerance)
        this.upRight = new QTree(this.AABB.cellUR(), this.tolerance)
        this.botLeft = new QTree(this.AABB.cellBL(), this.tolerance)
        this.botRight = new QTree(this.AABB.cellBR(), this.tolerance)

        point_list.forEach((point) => { //distribute points from parent cell to children
            this.upLeft.insert(point)
            this.upRight.insert(point)
            this.botLeft.insert(point)
            this.botRight.insert(point)
        })

        this.points = null //clear points from parent
    }


    queryRegion(area) {
        let temp = []
        if (!this.AABB.containsAABB(area)) {
            return temp
        } //prune irrelevant searches

        if (this.upLeft == null) { //skip parent nodes
            this.points.forEach((point) => {
                if (area.containsPoint(point)) {
                    temp.push(point)
                }
            }) //push points, only execute on leaf nodes
            return temp
        }

        //recurse down relevant search till leaf nodes are hit
        temp = temp.concat(this.upLeft.queryRegion(area))
        temp = temp.concat(this.upRight.queryRegion(area))
        temp = temp.concat(this.botLeft.queryRegion(area))
        temp = temp.concat(this.botRight.queryRegion(area))
        return temp
    }
}


function showTree(root) {

    if (root == null) { //base case
        return
    }

    root.AABB.draw('red')
    showTree(root.upLeft)
    showTree(root.upRight)
    showTree(root.botLeft)
    showTree(root.botRight)

}