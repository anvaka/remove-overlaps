var createTree = require('yaqt');
module.exports = removeOverlaps;

function removeOverlaps(positions) {
  var tree = createTree();
  // TODO: need to deal better with memory
  tree.init(positions.reduce(toFlatArray, []));

  var currentNode;

  for (var index = 0; index < positions.length; index++) {
    var posIdx = index * 2;
    currentNode = positions[index];
    tree.visit(visitTreeNode);
  }

  function visitTreeNode(node) {
    var bounds = node.bounds;
    var nodePoints = node.items;
    if (nodePoints) {
      // this is a leaf node, it can hold several items. We should check every
      // item to see if it overlaps with current node.
      nodePoints.forEach(moveIfNeeded);
    } else {
      // Continue subdivision only if current circle intersects our bounds
      // Find the closest point to the circle within the rectangle
      var closestX = clamp(currentNode.x, bounds.left(), bounds.x + bounds.half);
      var closestY = clamp(currentNode.y, bounds.top(), bounds.y + bounds.half);

      // Calculate the distance between the circle's center and this closest point
      var distanceX = currentNode.x - closestX;
      var distanceY = currentNode.y - closestY;

      // If the distance is less than the circle's radius, an intersection occurs
      var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
      return distanceSquared < (currentNode.r * currentNode.r);
    }
  }

  function clamp(v, min, max) {
    if (v < min) return min;
    if (v > max) return max;
    return v;
  }

  function moveIfNeeded(nodeIndex) {
    var otherNode = positions[nodeIndex/2];
    if (otherNode === currentNode) return;

    var dx = currentNode.x - otherNode.x;
    var dy = currentNode.y - otherNode.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var totalRadius = otherNode.r + currentNode.r;

    if (totalRadius <= distance) return; // they are not overlapping!

    // Otherwise we should move each node in opposite direction, so that distance
    // is equal to totalRadius
    var offset = (distance - totalRadius)/distance * 0.5;
    currentNode.x -= dx * offset;
    currentNode.y -= dy * offset;

    otherNode.x += dx * offset;
    otherNode.y += dy * offset;
  }
}

function toFlatArray(prevValue, currentValue) {
  prevValue.push(currentValue.x, currentValue.y);
  return prevValue;
}
