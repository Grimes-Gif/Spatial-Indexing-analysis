var point_list = []
var qt
var region_list = []
var x, y
const [REGION_MIN_X, REGION_MIN_Y] = [10, 10]

function setup() {
  createCanvas(windowWidth, windowHeight)
  qt = new QTree(new AABB(0,0,windowWidth, windowHeight), 5)
}

function draw() {
  background(220)

  if (mouseIsPressed) {
    showSelectedRegion()
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

function showSelectedRegion() {
  noFill()
  stroke('gray')
  rect(x, y, mouseX-x, mouseY-y)
}

function mouseReleased() {
  let width = Math.abs(mouseX-x)
  let height = Math.abs(mouseY-y)

  //if the mouse was dragged a unit of distance away, create a region on the scene
  if (width > REGION_MIN_X && height > REGION_MIN_Y) { 
    let cx = (mouseX + x) / 2
    let cy = (mouseY + y) / 2

    let selected_points = qt.queryRegion(region_list[region_list.push(
      new AABB(cx - width/2,cy - height/2, width, height))-1])

    selected_points.forEach((point) => {
      point.isSelected = true
    })
    
    console.log('pushed a region, ', region_list[region_list.length-1], ' that contains: ', selected_points.length, ' points')
  } else { //else add a point to the scene
    if (mouseButton == LEFT) {
      point_list.push(qt.insert(new point(mouseX, mouseY)))
    } else {
      region_list.pop()
    }
  }
}
