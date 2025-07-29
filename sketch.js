const view = 0.25
const [REGION_MIN_X, REGION_MIN_Y] = [40, 40]
var point_list = [] // global point list for drawing
var region_list = [] // global region list for drawing mouse selections
var qt
var x, y // controls for mouse functions
var tree_panel
var point_panel


function setup() {
  createCanvas(windowWidth, windowHeight)
  let screen_divide = windowWidth*view
  let max_depth = Math.log2(screen_divide)-Math.log2(REGION_MIN_X)
  tree_panel = new AABB(0,0,screen_divide,windowHeight)
  point_panel = new AABB(screen_divide,0,windowWidth-screen_divide,windowHeight)
  qt = new QTree(point_panel, 5, max_depth)
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
    //region.update()
    region.draw('black')
  })
  //console.log(tree_panel)
  tree_panel.draw('black', '#636363') // draw tree view panel
  showTree(qt) // draw point view and tree view 
}

//Drawing stuff <------------------------------------------------------------------------------------------------------------------>

//Show a selected area as mouse is dragged, called when mouse is pressed
function showSelectedRegion() {
  noFill()
  stroke('gray')
  rect(x, y, mouseX-x, mouseY-y)
}

//Override browser functions <----------------------------------------------------------------------------------------------------->

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

  if (!qt.AABB.containsPoint(x, y)) {
    return
  }

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
