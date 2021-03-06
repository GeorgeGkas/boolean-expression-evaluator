import { v4 as uuid } from 'uuid'

export const enum Operation {
  GENERIC = 'GENERIC',
  DISJUNCTION = 'Disjunction',
  CONJUNCTION = 'Conjunction',
  ARGUMENT = 'Argument',
  CONSTANT = 'Constant',
}

export type BinaryExpressionTreeNodeIdType = string
export type BinaryExpressionTreeNodeParentType =
  BinaryExpressionTreeNodeIdType | null
export type BinaryExpressionTreeNodeType<T> =
  | IGenericBinaryExpressionTreeNode
  | IArgumentBinaryExpressionTreeNode
  | IConstantBinaryExpressionTreeNode
  | IConjunctionBinaryExpressionTreeNode<T>
  | IDisjunctionBinaryExpressionTreeNode<T>
export type BinaryExpressionTreeNodeTypeArray = Array<
  | IGenericBinaryExpressionTreeNode
  | IArgumentBinaryExpressionTreeNode
  | IConstantBinaryExpressionTreeNode
  | IConjunctionBinaryExpressionTreeNode<BinaryExpressionTreeNodeTypeArray>
  | IDisjunctionBinaryExpressionTreeNode<BinaryExpressionTreeNodeTypeArray>
>

export interface IGenericBinaryExpressionTreeNode {
  id: BinaryExpressionTreeNodeIdType
  type: Operation.GENERIC
  value: 'select...'
  parent: BinaryExpressionTreeNodeParentType
  level: number
}

export interface IArgumentBinaryExpressionTreeNode {
  id: BinaryExpressionTreeNodeIdType
  type: Operation.ARGUMENT
  value: string
  parent: BinaryExpressionTreeNodeParentType
  level: number
}

export interface IConstantBinaryExpressionTreeNode {
  id: BinaryExpressionTreeNodeIdType
  type: Operation.CONSTANT
  value: boolean
  parent: BinaryExpressionTreeNodeParentType
  level: number
}

export interface IConjunctionBinaryExpressionTreeNode<T> {
  id: BinaryExpressionTreeNodeIdType
  type: Operation.CONJUNCTION
  value: T
  parent: BinaryExpressionTreeNodeParentType
  level: number
}

export interface IDisjunctionBinaryExpressionTreeNode<T> {
  id: BinaryExpressionTreeNodeIdType
  type: Operation.DISJUNCTION
  value: T
  parent: BinaryExpressionTreeNodeParentType
  level: number
}

export class BinaryExpressionTree {
  private rootId: BinaryExpressionTreeNodeIdType
  private nodePool: Map<
    BinaryExpressionTreeNodeIdType,
    BinaryExpressionTreeNodeType<Set<BinaryExpressionTreeNodeIdType>>
  > = new Map()

  constructor() {
    const root = this.createGenericNode(null, 0)
    this.rootId = root.id
    this.nodePool.set(root.id, root)
  }

  getRootId() {
    return this.rootId
  }

  getNodes() {
    return Array.from(this.nodePool.values())
  }

  getNodeFromId(nodeId: BinaryExpressionTreeNodeIdType) {
    return this.nodePool.get(nodeId)
  }

  addChildNode<T>(
    type: Operation,
    parentId: BinaryExpressionTreeNodeIdType,
    value?: T
  ): BinaryExpressionTreeNodeIdType {
    const parent = this.nodePool.get(parentId)!

    const node = {
      [Operation.GENERIC]: () =>
        this.createGenericNode(parentId, parent.level + 1),
      [Operation.ARGUMENT]: () =>
        this.createArgumentBinaryExpressionTreeNode(
          parentId,
          value as unknown as string,
          parent.level + 1
        ),
      [Operation.CONSTANT]: () =>
        this.createConstantBinaryExpressionTreeNode(
          parentId,
          value as unknown as boolean,
          parent.level + 1
        ),
      [Operation.CONJUNCTION]: () =>
        this.createConjunctionBinaryExpressionTreeNode(
          parentId,
          parent.level + 1
        ),
      [Operation.DISJUNCTION]: () =>
        this.createDisjunctionBinaryExpressionTreeNode(
          parentId,
          parent.level + 1
        ),
    }[type]()

    ;(parent.value as Set<BinaryExpressionTreeNodeIdType>).add(node.id)
    this.nodePool.set(node.id, node)

    return node.id
  }

  removeNodeById(nodeIdToRemove: BinaryExpressionTreeNodeIdType) {
    const thisNode = this.nodePool.get(nodeIdToRemove)!

    if (thisNode.type === Operation.GENERIC) {
      if (thisNode.id === this.rootId) {
        return
      }

      const parentNode = this.nodePool.get(thisNode.parent!)!

      if (
        parentNode.type === Operation.CONJUNCTION ||
        parentNode.type === Operation.DISJUNCTION
      ) {
        if (
          (parentNode.value as Set<BinaryExpressionTreeNodeIdType>).size < 3
        ) {
          return
        }
      }

      ;(parentNode!.value as Set<BinaryExpressionTreeNodeIdType>).delete(
        thisNode.id
      )
      this.nodePool.delete(thisNode.id)

      return
    }

    for (const childNodesToRemove of this.traversalDFS(nodeIdToRemove)) {
      if (childNodesToRemove.id === nodeIdToRemove) {
        this.changeNodeTypeById(
          nodeIdToRemove,
          Operation.GENERIC,
          'select...',
          true
        )
        continue
      }

      this.nodePool.delete(childNodesToRemove.id)
    }
  }

  changeNodeTypeById(
    nodeId: BinaryExpressionTreeNodeIdType,
    newNodeType: Operation,
    newNodeValue?: string | boolean,
    allowComplexToSimplex = false
  ) {
    const node = this.nodePool.get(nodeId)!

    if (
      !allowComplexToSimplex &&
      (node.type === Operation.CONJUNCTION ||
        node.type === Operation.DISJUNCTION) &&
      newNodeType !== Operation.CONJUNCTION &&
      newNodeType !== Operation.DISJUNCTION
    ) {
      throw new Error('is not possible to change complex operation to simple')
    }

    if (
      (newNodeType === Operation.CONJUNCTION ||
        newNodeType === Operation.DISJUNCTION) &&
      node.type !== Operation.CONJUNCTION &&
      node.type !== Operation.DISJUNCTION
    ) {
      const genericNode1 = this.createGenericNode(node.id, node.level + 1)
      const genericNode2 = this.createGenericNode(node.id, node.level + 1)

      this.nodePool.set(genericNode1.id, genericNode1)
      this.nodePool.set(genericNode2.id, genericNode2)

      node.value = new Set([genericNode1.id, genericNode2.id]) as any
      node.type = newNodeType as any
      return
    }

    node.type = newNodeType
    node.value = newNodeValue ?? node.value
  }

  changeNodeValueById(
    nodeId: BinaryExpressionTreeNodeIdType,
    value: string | boolean | Set<BinaryExpressionTreeNodeIdType>
  ) {
    const node = this.nodePool.get(nodeId)!

    node.value = value
  }

  createGenericNode(
    parent: BinaryExpressionTreeNodeParentType,
    level: number
  ): IGenericBinaryExpressionTreeNode {
    return {
      id: uuid(),
      type: Operation.GENERIC,
      value: 'select...',
      parent,
      level,
    }
  }

  createArgumentBinaryExpressionTreeNode(
    parent: BinaryExpressionTreeNodeParentType,
    argValue: string,
    level: number
  ): IArgumentBinaryExpressionTreeNode {
    const thisNodeId = uuid()

    return {
      id: thisNodeId,
      type: Operation.ARGUMENT,
      value: argValue,
      parent,
      level,
    }
  }

  createConstantBinaryExpressionTreeNode(
    parent: BinaryExpressionTreeNodeParentType,
    constantValue: boolean,
    level: number
  ): IConstantBinaryExpressionTreeNode {
    const thisNodeId = uuid()

    return {
      id: thisNodeId,
      type: Operation.CONSTANT,
      value: constantValue,
      parent,
      level,
    }
  }

  createDisjunctionBinaryExpressionTreeNode(
    parent: BinaryExpressionTreeNodeParentType,
    level: number
  ): IDisjunctionBinaryExpressionTreeNode<Set<BinaryExpressionTreeNodeIdType>> {
    const thisNodeId = uuid()

    const genericNode1 = this.createGenericNode(thisNodeId, level + 1)
    const genericNode2 = this.createGenericNode(thisNodeId, level + 1)

    this.nodePool.set(genericNode1.id, genericNode1)
    this.nodePool.set(genericNode2.id, genericNode2)

    return {
      id: thisNodeId,
      type: Operation.DISJUNCTION,
      value: new Set([genericNode1.id, genericNode2.id]),
      parent,
      level,
    }
  }

  createConjunctionBinaryExpressionTreeNode(
    parent: BinaryExpressionTreeNodeParentType,
    level: number
  ): IConjunctionBinaryExpressionTreeNode<Set<BinaryExpressionTreeNodeIdType>> {
    const thisNodeId = uuid()

    const genericNode1 = this.createGenericNode(thisNodeId, level + 1)
    const genericNode2 = this.createGenericNode(thisNodeId, level + 1)

    this.nodePool.set(genericNode1.id, genericNode1)
    this.nodePool.set(genericNode2.id, genericNode2)

    return {
      id: thisNodeId,
      type: Operation.CONJUNCTION,
      value: new Set([genericNode1.id, genericNode2.id]),
      parent,
      level,
    }
  }

  *traversalDFS(rootNodeId: BinaryExpressionTreeNodeIdType) {
    const visitedNodeIds: Set<BinaryExpressionTreeNodeIdType> = new Set()
    const stack: BinaryExpressionTreeNodeIdType[] = []

    stack.push(rootNodeId)

    while (stack.length) {
      const nodeId = stack.pop()!
      if (!visitedNodeIds.has(nodeId)) {
        const node = this.nodePool.get(nodeId)!
        if (
          node.type === Operation.CONJUNCTION ||
          node.type === Operation.DISJUNCTION
        ) {
          for (const childNodesId of node.value) {
            stack.push(childNodesId)
          }
        }

        yield node
      }
    }
  }

  *traversalPostOrder(rootNodeId: BinaryExpressionTreeNodeIdType) {
    const stack: BinaryExpressionTreeNodeIdType[] = []
    let lastVisitedChild: BinaryExpressionTreeNodeIdType | null = null

    stack.push(rootNodeId)

    while (stack.length) {
      const nodeId = stack[stack.length - 1]
      const node = this.nodePool.get(nodeId)!

      if (
        (node.type !== Operation.CONJUNCTION &&
          node.type !== Operation.DISJUNCTION) ||
        !node.value.size ||
        (lastVisitedChild && node.value.has(lastVisitedChild))
      ) {
        yield node
        stack.pop()
        lastVisitedChild = node.id
      } else {
        const nodeChildrenId = [...node.value].reverse()
        for (const childId of nodeChildrenId) {
          stack.push(childId)
        }
      }
    }
  }

  dereferenceChildren(nodeId: BinaryExpressionTreeNodeIdType) {
    const node = this.nodePool.get(nodeId)!

    if (
      node.type === Operation.CONJUNCTION ||
      node.type === Operation.DISJUNCTION
    ) {
      const dereferencedChildren: BinaryExpressionTreeNodeTypeArray = []
      for (const childId of node.value) {
        dereferencedChildren.push(this.dereferenceChildren(childId))
      }
      node.value = dereferencedChildren as any
    }

    return node as BinaryExpressionTreeNodeType<BinaryExpressionTreeNodeTypeArray>
  }

  toJSON(): BinaryExpressionTreeNodeType<BinaryExpressionTreeNodeTypeArray> {
    return this.dereferenceChildren(this.rootId)
  }
}
