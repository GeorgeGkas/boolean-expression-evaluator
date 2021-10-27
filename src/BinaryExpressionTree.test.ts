import { BinaryExpressionTree, BinaryExpressionTreeNodeIdType, BinaryExpressionTreeNodeTypeArray, Operation } from './BinaryExpressionTree';

test('should return generic node type on new tree', () => {
  const tree = new BinaryExpressionTree()
  const treeJSON = tree.toJSON()

  expect(treeJSON).toHaveProperty('id') 
  expect(treeJSON.type).toBe(Operation.GENERIC)
  expect(treeJSON.value).toBe('select...')
  expect(treeJSON.parent).toBe(null)
})

test('should change root operation type into constant true', () => {
  const tree = new BinaryExpressionTree()

  tree.changeNodeTypeById(tree.getRootId(), Operation.CONSTANT, true)

  const treeJSON = tree.toJSON()

  expect(treeJSON).toHaveProperty('id') 
  expect(treeJSON.type).toBe(Operation.CONSTANT)
  expect(treeJSON.value).toBe(true)
  expect(treeJSON.parent).toBe(null)
})

test('should change root operation type into constant false', () => {
  const tree = new BinaryExpressionTree()

  tree.changeNodeTypeById(tree.getRootId(), Operation.CONSTANT, false)

  const treeJSON = tree.toJSON()

  expect(treeJSON).toHaveProperty('id') 
  expect(treeJSON.type).toBe(Operation.CONSTANT)
  expect(treeJSON.value).toBe(false)
  expect(treeJSON.parent).toBe(null)
})

test('should change root operation type into custom argument name', () => {
  const tree = new BinaryExpressionTree()

  tree.changeNodeTypeById(tree.getRootId(), Operation.ARGUMENT, 'some argument name')

  const treeJSON = tree.toJSON()

  expect(treeJSON).toHaveProperty('id') 
  expect(treeJSON.type).toBe(Operation.ARGUMENT)
  expect(treeJSON.value).toBe('some argument name')
  expect(treeJSON.parent).toBe(null)
})

test('should change root operation type into conjunction', () => {
  const tree = new BinaryExpressionTree()

  tree.changeNodeTypeById(tree.getRootId(), Operation.CONJUNCTION)

  const treeJSON = tree.toJSON()

  expect(treeJSON).toHaveProperty('id') 
  expect(treeJSON.type).toBe(Operation.CONJUNCTION)
  expect((treeJSON.value as BinaryExpressionTreeNodeTypeArray).length).toBe(2)
  expect(treeJSON.parent).toBe(null)
})

test('should change root operation type into disjunction', () => {
  const tree = new BinaryExpressionTree()

  tree.changeNodeTypeById(tree.getRootId(), Operation.DISJUNCTION)

  const treeJSON = tree.toJSON()

  expect(treeJSON).toHaveProperty('id') 
  expect(treeJSON.type).toBe(Operation.DISJUNCTION)
  expect((treeJSON.value as BinaryExpressionTreeNodeTypeArray).length).toBe(2)
  expect(treeJSON.parent).toBe(null)
})

test('should return simple disjunction operation with constant operands', () => {
  const tree = new BinaryExpressionTree()
  tree.changeNodeTypeById(tree.getRootId(), Operation.DISJUNCTION)
  tree.addChildNode(Operation.CONSTANT, tree.getRootId(), true)

  const treeJSON = tree.toJSON()

  expect(treeJSON).toHaveProperty('id') 
  expect(treeJSON.type).toBe(Operation.DISJUNCTION)
  expect((treeJSON.value as BinaryExpressionTreeNodeTypeArray).length).toBe(3)
  expect(treeJSON.parent).toBe(null)
})

test('should traverse tree in post order', () => {
  const tree = new BinaryExpressionTree()
  tree.changeNodeTypeById(tree.getRootId(), Operation.DISJUNCTION)
  const id = tree.addChildNode(Operation.DISJUNCTION, tree.getRootId(), true)
  const id2 = tree.addChildNode(Operation.CONSTANT, id, false)
  tree.changeNodeTypeById(id2, Operation.DISJUNCTION)

  expect(Array.from(tree.traversalPostOrder(tree.getRootId())).length).toBe(9) 
  expect(Array.from(tree.traversalPostOrder(id)).length).toBe(6) 
  expect(Array.from(tree.traversalPostOrder(id2)).length).toBe(3) 
})

test('should traverse tree in dfs', () => {
  const tree = new BinaryExpressionTree()
  tree.changeNodeTypeById(tree.getRootId(), Operation.DISJUNCTION)
  const id = tree.addChildNode(Operation.DISJUNCTION, tree.getRootId(), true)
  const id2 = tree.addChildNode(Operation.CONSTANT, id, false)
  tree.changeNodeTypeById(id2, Operation.DISJUNCTION)

  expect(Array.from(tree.traversalDFS(tree.getRootId())).length).toBe(9) 
  expect(Array.from(tree.traversalDFS(id)).length).toBe(6) 
  expect(Array.from(tree.traversalDFS(id2)).length).toBe(3) 
})

test('should return a JSON representation of the tree with dereferenced values', () => {
  const tree = new BinaryExpressionTree()
  tree.changeNodeTypeById(tree.getRootId(), Operation.DISJUNCTION)
  const id = tree.addChildNode(Operation.DISJUNCTION, tree.getRootId(), true)
  const id2 = tree.addChildNode(Operation.CONSTANT, id, false)
  tree.changeNodeTypeById(id2, Operation.DISJUNCTION)

  JSON.stringify(tree.toJSON(), null, 2)
})

test('should not allow deletion of root node if is generic', () => {
  const tree = new BinaryExpressionTree()
  const rootId = tree.getRootId()

  tree.removeNodeById(rootId)

  expect(tree.getRootId()).toBe(rootId)
})

test('should replace simple tree with generic', () => {
  const tree = new BinaryExpressionTree()
  tree.changeNodeTypeById(tree.getRootId(), Operation.CONSTANT, false)

  expect(tree.getNodeFromId(tree.getRootId())!.type).toBe(Operation.CONSTANT)
  expect(tree.getNodes().length).toBe(1)

  tree.removeNodeById(tree.getRootId())

  expect(tree.getNodeFromId(tree.getRootId())!.type).toBe(Operation.GENERIC)
  expect(tree.getNodes().length).toBe(1)

})

test('should replace complex tree with generic and remove all the children.', () => {
  const tree = new BinaryExpressionTree()
  tree.changeNodeTypeById(tree.getRootId(), Operation.DISJUNCTION)
  const id = tree.addChildNode(Operation.DISJUNCTION, tree.getRootId(), true)
  const id2 = tree.addChildNode(Operation.CONSTANT, id, false)
  tree.changeNodeTypeById(id2, Operation.DISJUNCTION)

  expect(tree.getNodes().length).toBe(9)

  tree.removeNodeById(id)
  const changedNode = tree.getNodeFromId(id)!

  expect(tree.getNodes().length).toBe(4)

  expect(changedNode.type).toBe(Operation.GENERIC)
  expect(changedNode.value).toBe('select...')

})

test('should remove subtree complex node if is generic and remove it from parent', () => {
  const tree = new BinaryExpressionTree()
  tree.changeNodeTypeById(tree.getRootId(), Operation.DISJUNCTION)
  const rootNode = tree.getNodeFromId(tree.getRootId())!
  tree.addChildNode(Operation.GENERIC, tree.getRootId())
  const rootNodeChildren = Array.from((rootNode.value as Set<BinaryExpressionTreeNodeIdType>))

  expect(tree.getNodes().length).toBe(4)
  expect(rootNodeChildren.length).toBe(3)

  const nodeIdToRemove = rootNodeChildren[0]

  expect(tree.getNodeFromId(nodeIdToRemove)).toBeTruthy()
  expect(tree.getNodeFromId(nodeIdToRemove)!.type).toBe(Operation.GENERIC)

  tree.removeNodeById(nodeIdToRemove)

  expect(tree.getNodes().length).toBe(3)
  expect(tree.getNodeFromId(nodeIdToRemove)).toBeFalsy()

  expect(Array.from((rootNode.value as Set<BinaryExpressionTreeNodeIdType>)).length).toBe(2)
})

test('should not remove subtree complex node is has only two children', () => {
  const tree = new BinaryExpressionTree()
  tree.changeNodeTypeById(tree.getRootId(), Operation.DISJUNCTION)
  const rootNode = tree.getNodeFromId(tree.getRootId())!
  const rootNodeChildren = Array.from((rootNode.value as Set<BinaryExpressionTreeNodeIdType>))

  expect(tree.getNodes().length).toBe(3)
  expect(rootNodeChildren.length).toBe(2)

  const nodeIdToRemove = rootNodeChildren[0]

  expect(tree.getNodeFromId(nodeIdToRemove)).toBeTruthy()
  expect(tree.getNodeFromId(nodeIdToRemove)!.type).toBe(Operation.GENERIC)

  tree.removeNodeById(nodeIdToRemove)

  expect(tree.getNodes().length).toBe(3)
  expect(tree.getNodeFromId(nodeIdToRemove)).toBeTruthy()

  expect(Array.from((rootNode.value as Set<BinaryExpressionTreeNodeIdType>)).length).toBe(2)
})

test('should replace simple subtree into generic.', () => {
  const tree = new BinaryExpressionTree()
  tree.changeNodeTypeById(tree.getRootId(), Operation.DISJUNCTION)
  const id = tree.addChildNode(Operation.DISJUNCTION, tree.getRootId(), true)
  const id2 = tree.addChildNode(Operation.CONSTANT, id, false)

  expect(tree.getNodeFromId(id2)!.type).toBe(Operation.CONSTANT)

  tree.removeNodeById(id2)

  expect(tree.getNodeFromId(id2)!.type).toBe(Operation.GENERIC)
})

test('should replace complex subtree into generic and remove all the children.', () => {
  const tree = new BinaryExpressionTree()
  tree.changeNodeTypeById(tree.getRootId(), Operation.DISJUNCTION)
  const id = tree.addChildNode(Operation.DISJUNCTION, tree.getRootId(), true)
  const id2 = tree.addChildNode(Operation.CONSTANT, id, false)

  expect(tree.getNodeFromId(id)!.type).toBe(Operation.DISJUNCTION)
  expect(tree.getNodes().length).toBe(7)

  tree.removeNodeById(id)

  expect(tree.getNodeFromId(id)!.type).toBe(Operation.GENERIC)
  expect(tree.getNodes().length).toBe(4)
})