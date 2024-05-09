var point_list = []
var qt
var region_list = []
var x, y
const [REGION_MIN_X, REGION_MIN_Y] = [15, 15]

function setup() {
  createCanvas(windowWidth, windowHeight)
  qt = new QTree(new AABB(0,0,windowWidth, windowHeight), 5, Math.log2(windowWidth)-Math.log2(REGION_MIN_X))
}

//Show a selected area as mouse is dragged, called when mouse is pressed
function showSelectedRegion() {
  noFill()
  stroke('gray')
  rect(x, y, mouseX-x, mouseY-y)
}

//Global funcs for percision in dynamic environment (safe iteration)
function Global_update() {
  //call all updates
}

function Global_draw() {
  //call all rendering
}


function draw() {
  background(220)
  if (mouseIsPressed) {
    showSelectedRegion()
  }

  //update and draw every point, this might need to be changed to an update all -> draw all paradigm when collisions are added
  point_list.forEach((point) => {
    point.update()
    point.draw()
  })


  region_list.forEach((region) => {
    region.update()
    region.draw('black')
  })

  showTree(qt)
}





//Override browser functions


//Save coordinates on mouse press
function mousePressed() {
  x = mouseX
  y = mouseY
}

/*
When mouse is released, check if the mouse has moved a minimum distance away from start point
if so, add a region, if not add a point.
*/
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
      point_list.push(qt.insert(new point(new Vector(mouseX, mouseY))))
    } else {
      region_list.pop()
    }
  }
}
