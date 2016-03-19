var test = require('tap').test;
var removeOverlaps = require('../');

test('it can remove overalps', function(t) {
  var circles = [
    {x: 0, y: 0, r: 10},
    {x: 1, y: 0, r: 3}
  ]
  var lastMove = removeOverlaps(circles);
  var dist =  distance(circles[0], circles[1]);
  t.ok(dist >= 13, 'it moved circles far enough');
  t.ok(lastMove < 1, 'it converged!');
  t.end();
});

function distance(a, b) {
  return Math.sqrt(((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)))
}
