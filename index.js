var createTree = require('yaqt');

var circle = require('./lib/circleCheck.js');

module.exports = removeOverlaps;

function removeOverlaps(positions, options) {
  var tree = createTree();
  // TODO: need to deal better with memory
  tree.init(positions.reduce(toFlatArray, []));
  if (!options) options = {};

  var currentNode;
  var totalMovement = 0;
  var maxMove = typeof options.maxMove === 'number' ? options.maxMove : 1;
  var maxIterations = typeof options.maxIterations === 'number' ? options.maxIterations : 10;
  var method = circle

  for (var i = 0; i < maxIterations ; ++i) {
    totalMovement = 0;
    for (var index = 0; index < positions.length; index++) {
      currentNode = positions[index];
      tree.visit(visitTreeNode);
    }
    if (totalMovement < maxMove) break;
  }

  return totalMovement;

  function visitTreeNode(node) {
    var bounds = node.bounds;
    var nodePoints = node.items;
    if (nodePoints) {
      // this is a leaf node, it can hold several items. We should check every
      // Check every item to see if it overlaps with current node.
      nodePoints.forEach(moveIfNeeded);
    } else {
      return method.intersectQuad(currentNode, bounds)
    }
  }

  function moveIfNeeded(nodeIndex) {
    var otherNode = positions[nodeIndex/2];
    if (otherNode === currentNode) return;

    totalMovement += method.removeOverlap(currentNode, otherNode);
  }
}


function toFlatArray(prevValue, currentValue) {
  prevValue.push(currentValue.x, currentValue.y);
  return prevValue;
}
