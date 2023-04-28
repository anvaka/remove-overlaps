# remove-overlaps [![build status](https://github.com/anvaka/remove-overlaps/actions/workflows/tests.yaml/badge.svg)](https://github.com/anvaka/remove-overlaps/actions/workflows/tests.yaml)


Given set of N circles at predefined positions attempts to remove overlap between circles.
[Demo](https://anvaka.github.io/remove-overlaps/demo/).

# usage

By default remove overlaps will remove overlaps from circles:

``` js
var removeOverlaps = require('remove-overlaps')
var circles = [
  {x: 0, y: 0, r: 10},
  {x: 1, y: 0, r: 3}
]
var lastMove = removeOverlaps(circles)
var dist = distance(circles[0], circles[1])
assert(dist >= 13, 'it moved circles far enough')
assert(lastMove < 1, 'it converged!')
```

If you have rectangular objects, then to remove overlaps:

``` js
var removeOverlaps = require('remove-overlaps')

// Each rectangle has x,y properties - they are centers of the rectangles
// Width and height are width and height. So if you want to have a standard
// left/top/right/bottom approach then:
//
// left = x - width/2
// right = x + width/2
// top = y - height/2
// bottom = y + height/2
var rectangles = [
  {x: 0, y: 0, width: 10, height: 10},
  {x: 0, y: 0, width: 3, height: 4}
]
var lastMove = removeOverlaps(rectangles)
assert(lastMove < 1, 'it converged!')
assert(!rectangeOverlaps(rectangles[0], rectangles[1]), 'Recangles do not overlap anymore')
```

# Performance considerations

The library is not RAM optimized, but uses QuadTrees to optimize CPU. Under the
hood it constructs a quad tree from given set of points, and then performs several
iterations of overlap lookup:

```
1. put each node into a quad tree
2. for each node:
3.  if node A overlaps other node B, then
4.    Remove overlap between A and B
5. Go to #2 and repeat until either no overlaps found or
   maximum amount of iterations reached.
```

In theory since line #4 removes overlap only between two nodes, there is no
guarantee that algorithm converges. In practice it converges most of the time
in very few steps (thus step #5 repeats algorithm several times)

# license

MIT
