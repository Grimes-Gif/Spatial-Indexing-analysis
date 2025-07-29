//TODO: must make dynamic, requires necessary sparsity 

//pointer enforced
class QTree {

    constructor(AABB, tolerance, max_depth) {
        this.AABB = AABB
        this.tolerance = tolerance
        this.points = []
        this.max_depth = max_depth
    }

    insert(point) {
        let split = false
        //check if point is in bounds of this cell, if not check another cell
        if (!this.AABB.containsPoint(point.pos.x, point.pos.y)) {
            return
        }

        //if we can add a point to the current cell, do so
        if (this.upLeft == null && this.points.length < this.tolerance) {
            this.points.push(point)
            return point
        } else { //else we subdivide and continue on
            if (this.upLeft == null) {
                this.subdivide(this.points)
                split = true
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
                if (area.containsPoint(point.pos.x, point.pos.y)) {
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

    update() {
        //check to see if points are still in its nodes
    }

    remove() {
        //need to remove nodes when it becomes empty
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

