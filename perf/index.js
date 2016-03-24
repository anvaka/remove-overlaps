var random = require('ngraph.random').random(42);
var Benchmark = require('benchmark');
var removeOverlaps = require('../index.js');
var count = 1000;

console.log(process.versions);
console.log('figures #' + count);
var suite = new Benchmark.Suite;

// add tests
suite.add('Remove overlaps for circles', function() {
  var circles = createCircles();
  removeOverlaps(circles);
})
.add('Remove overlaps for rectnagles', function() {
  var rectangles = createRectangles();
  removeOverlaps(rectangles, {
    method: 'rectangle'
  });
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
// run async
.run({ 'async': true });

function createCircles() {
  var array = [];
  for (var i = 0; i < count; ++i) {
    array.push({
      x: count - 2 * random.next(count),
      y: count - 2 * random.next(count),
      r: random.next(100) + 1
    });
  }
  return array;
}

function createRectangles() {
  var array = [];
  for (var i = 0; i < count; ++i) {
    array.push({
      x: count - 2 * random.next(count),
      y: count - 2 * random.next(count),
      width: random.next(100) + 1,
      height: random.next(100) + 1,
    });
  }
  return array;
}
