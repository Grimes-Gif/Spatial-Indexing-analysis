var point_list = []
var qt
var inverted = false
var region_list = []
var x, y
const [REGION_MIN_X, REGION_MIN_Y] = [10, 10]

var timer = 0

function setup() {
  createCanvas(windowWidth, windowHeight)
  qt = new QTree(new AABB(0,0,windowWidth, windowHeight), 5)
}

function draw() {
  background(220)

  if (mouseIsPressed) {
    showSelectedRegion()
    timer++
  }

  point_list.forEach((point) => {
      point.draw()
      point.update()
  })

  region_list.forEach((region) => {
    region.draw('black')
  })

  showTree(qt)
}


//Override browser functions
function mousePressed() {
  x = mouseX
  y = mouseY
}

function mouseDragged() {
  if (x - mouseX > 0) { //mouse is going left
    inverted = true
  } else {
    inverted = false
  }
}

function showSelectedRegion() {
  noFill()
  stroke('black')
  rect(x, y, mouseX-x, mouseY-y)
}

function mouseReleased() {
  if (timer > 15 && Math.abs(mouseX-x) > REGION_MIN_X && Math.abs(mouseY-y) > REGION_MIN_Y) {
    let selected_points = qt.queryRegion(region_list[region_list.push(new AABB(x, y, mouseX-x, mouseY-y))-1])
    selected_points.forEach((point) => {
      point.isSelected = true
    })
    console.log('pushed a region, ', region_list[-1], ' that contains: ', selected_points.length, ' points')
  } else if (timer <= 15) {
    point_list.push(qt.insert(new point(mouseX, mouseY)))
  }
  timer = 0
}
