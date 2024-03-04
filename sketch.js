var point_diameter = 10
let point_list = []
let qt = null

function setup() {
  createCanvas(windowWidth, windowHeight)
  qt = new QTree(new region(0,0,windowWidth, windowHeight), 5)
}

function draw() {
  background(220);

  point_list.forEach((point) => {
      let c = color('green')
      fill(c)
      circle(point.x, point.y, point_diameter)
    }
  )

  showTree(qt)
}


function mousePressed() {
  point_list.push(qt.insert(new point(mouseX, mouseY)))
}