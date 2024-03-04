class point {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
}


class region {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    setUpperLeft() {
        return new region(this.x, this.y, this.w/2, this.h/2)
    }

    setUpperRight() {
        return new region(this.x + this.w/2, this.y, this.w/2, this.h/2)
    }

    setLowerLeft() {
        return new region(this.x, this.y + this.h/2, this.w/2, this.h/2)
    }

    setLowerRight() {
        return new region(this.x + this.w/2, this.y + this.h/2, 
            this.w/2, this.h/2)
    }

    contains(point) {
        if (point.x > this.x && point.x < this.x + this.w) {
            if (point.y > this.y && point.y < this.y + this.h) {
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
        if (!this.boundary.contains(point)) {
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
            this.downLeft.insert(point)
            this.downRight.insert(point)
        }

        return point
    }
    
    subdivide(point_list) {
        this.upLeft = new QTree(this.boundary.setUpperLeft(), this.tolerance)
        this.upRight = new QTree(this.boundary.setUpperRight(), this.tolerance)
        this.downLeft = new QTree(this.boundary.setLowerLeft(), this.tolerance)
        this.downRight = new QTree(this.boundary.setLowerRight(), this.tolerance)

        point_list.forEach((point) => { //distribute points from parent cell to children
            if (this.upLeft.boundary.contains(point)) {
                this.upLeft.points.push(point)
            } else if (this.upRight.boundary.contains(point)) {
                this.upRight.points.push(point)
            } else if (this.downLeft.boundary.contains(point)) {
                this.downLeft.points.push(point)
            } else {
                this.downRight.points.push(point)
            }
        })

    }
}


function showTree(root) {

    if (root == null) { //base case
        return
    } 

    root.boundary.draw()
    showTree(root.upLeft)
    showTree(root.upRight)
    showTree(root.downLeft)
    showTree(root.downRight)

}