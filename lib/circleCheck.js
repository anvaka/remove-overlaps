/**
 * Performs removal of overal between two circular nodes
 */
var clamp = require('./clamp.js');

module.exports = {
  intersectQuad: function(currentNode, quad) {
    // Continue subdivision only if current circle intersects our quad
    // Find the closest point to the circle within the rectangle
    var closestX = clamp(currentNode.x, quad.left(), quad.x + quad.half);
    var closestY = clamp(currentNode.y, quad.top(), quad.y + quad.half);

    // Calculate the distance between the circle's center and this closest point
    var dx = currentNode.x - closestX;
    var dy = currentNode.y - closestY;

    // If the distance is less than the circle's radius, an intersection occurs
    var distanceSquared = dx * dx + dy * dy;
    return distanceSquared < (currentNode.r * currentNode.r);
  },

  removeOverlap: function(currentNode, otherNode) {
    var dx = currentNode.x - otherNode.x;
    var dy = currentNode.y - otherNode.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var totalRadius = otherNode.r + currentNode.r;

    if (totalRadius <= distance) return 0; // they are not overlapping!

    // Otherwise we should move each node in opposite direction, so that distance
    // is equal to totalRadius
    var offset = (distance - totalRadius)/distance * 0.5;
    var mx = dx * offset;
    var my = dy * offset;

    currentNode.x -= mx;
    currentNode.y -= my;

    otherNode.x += mx;
    otherNode.y += my;

    return Math.abs(mx) + Math.abs(my);
  }
};
