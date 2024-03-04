class point {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.speed = .1
        this.diameter = 10
    }

    update() {

    }

    draw() {
        fill(color('green'))
        circle(this.x, this.y, this.diameter)
    }
}


class region {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    cellUL() {
        return new region(this.x, this.y, this.w/2, this.h/2)
    }

    cellUR() {
        return new region(this.x + this.w/2, this.y, this.w/2, this.h/2)
    }

    cellBL() {
        return new region(this.x, this.y + this.h/2, this.w/2, this.h/2)
    }

    cellBR() {
        return new region(this.x + this.w/2, this.y + this.h/2, 
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

    containsRegion(region) {
        if (this.x < region.x + region.w && region.x < this.x + this.w) { //check for horizontal overlap
            if (this.y < region.y + region.h && region.y < this.y + this.h) { //check for vertical overlap
                return true
            }
        }

        return false
    }

    draw() {
        stroke('red')
        noFill()
        rect(this.x, this.y, this.w, this.h)
    }
}

//pointer enforced
class QTree {

    constructor(boundary, tolerance) {
        this.boundary = boundary
        this.tolerance = tolerance
        this.points = []
    }

    insert(point) {
        
        //check if point is in bounds of this cell, if not check another cell
        if (!this.boundary.containsPoint(point)) {
            return
        }

        //if we can add a point to the current cell, do so
        if (this.points.length < this.tolerance) {
            this.points.push(point)
            return point
        } else { //else we check to see if the current node has children
            if (this.upLeft == null) { 
                this.subdivide(this.points) //if not, subdivide first
            } 
            this.upLeft.insert(point)
            this.upRight.insert(point)
            this.botLeft.insert(point)
            this.botRight.insert(point)
        }

        return point
    }
    
    subdivide(point_list) {
        this.upLeft = new QTree(this.boundary.cellUL(), this.tolerance)
        this.upRight = new QTree(this.boundary.cellUR(), this.tolerance)
        this.botLeft = new QTree(this.boundary.cellBL(), this.tolerance)
        this.botRight = new QTree(this.boundary.cellBR(), this.tolerance)

        point_list.forEach((point) => { //distribute points from parent cell to children
            if (this.upLeft.boundary.containsPoint(point)) {
                this.upLeft.points.push(point)
            } else if (this.upRight.boundary.containsPoint(point)) {
                this.upRight.points.push(point)
            } else if (this.botLeft.boundary.containsPoint(point)) {
                this.botLeft.points.push(point)
            } else {
                this.botRight.points.push(point)
            }
        })

        this.points = []
    }


    queryRegion(area) {
        let inRegion = []
        if (!this.boundary.containsRegion(area)) {
            return inRegion
        } //termiante if not in region 

        this.points.forEach((point) => {
            if (area.containsPoint(point)) {
                inRegion.push(point)
            }
        }) //push points, should only execute on leaf nodes

        if (this.upLeft == null) {
            return inRegion
        } //recurse from any starting node, to leaf nodes 

        inRegion.concat(this.upLeft.queryRegion(area))
        inRegion.concat(this.upRight.queryRegion(area))
        inRegion.concat(this.botLeft.queryRegion(area))
        inRegion.concat(this.botRight.queryRegion(area))

        return inRegion
    }

    
}


function showTree(root) {

    if (root == null) { //base case
        return
    } 

    root.boundary.draw()
    showTree(root.upLeft)
    showTree(root.upRight)
    showTree(root.botLeft)
    showTree(root.botRight)

}