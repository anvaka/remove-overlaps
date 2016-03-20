/**
 * Performs removal of overal between two circular nodes
 */
module.exports = {
  intersectQuad: function(currentNode, quad) {
    var xHalf = currentNode.width / 2;
    var yHalf = currentNode.height / 2;
    var left = currentNode.x - xHalf;
    var top = currentNode.y - yHalf;
    var right = currentNode.x + xHalf;
    var bottom = currentNode.y + yHalf;

    // Continue subdivision only if current rectangle intersects our quad
    // http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
    return left < quad.x + quad.half &&
      right > quad.x - quad.half &&
      top < quad.y + quad.half &&
      bottom > quad.y - quad.half;
  },

  removeOverlap: function(a, b) {
    var ox = Math.min(a.x + a.width / 2, b.x + b.width / 2) - Math.max(a.x - a.width / 2, b.x - b.width / 2);
    var oy = Math.min(a.y + a.height / 2, b.y + b.height / 2) - Math.max(a.y - a.height / 2, b.y - b.height / 2);

    if (ox > 0 && oy > 0) {
      return move(ox, oy, a, b);
    }

    return 0;
  },

  validate: function(positions) {
    positions.forEach(validatePosition);
  }

};

function move(ox, oy, a, b) {
  // shift along the axis of ideal/target positions
  // so boxes can cross each other rather than collide
  // this makes the result more predictable

  var vx0 = (a.x + a.width / 2) - (b.x + b.width / 2);
  var vy0 = (a.y + a.height / 2) - (b.y + b.width / 2),
    v0 = Math.sqrt(vx0 * vx0 + vy0 * vy0),
    shift = Math.sqrt(ox * oy),
    shiftX,
    shiftY;

  if (v0 !== 0) {
    vx0 /= v0;
    vy0 /= v0;
  } else {
    var phi = Math.random() * 2 * Math.PI;
    vx0 = Math.cos(phi);
    vy0 = Math.sin(phi);
  }

  shiftX = shift * vx0;
  shiftY = shift * vy0;

  a.x += shiftX;
  b.x -= shiftX;
  a.y += shiftY;
  b.y -= shiftY;

  return Math.abs(shiftX) + Math.abs(shiftY);
}

function validatePosition(p) {
  if (p.x === undefined) throw new Error('[rectangular overlap removal] x - center of the rectangle must be defined ' + p)
  if (p.y === undefined) throw new Error('[rectangular overlap removal] y - center of the rectangle must be defined ' + p)
  if (p.width === undefined) throw new Error('[rectangular overlap removal] width of the rectangle must be defined ' + p)
  if (p.height === undefined) throw new Error('[rectangular overlap removal] height rectangle must be defined ' + p)
}
