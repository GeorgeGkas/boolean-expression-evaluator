import { Args } from './ArgsBuilder'
import {
  BinaryExpressionTreeNodeType,
  BinaryExpressionTreeNodeIdType,
  Operation,
} from './BinaryExpressionTree'

const evaluateOperation = (
  binaryExpressionTreeNodesPostOrder: BinaryExpressionTreeNodeType<
    Set<BinaryExpressionTreeNodeIdType>
  >[],
  args: Args
) => {
  let stack: boolean[] = []

  for (const node of binaryExpressionTreeNodesPostOrder) {
    if (node.type === Operation.GENERIC) {
      return undefined
    } else if (node.type === Operation.ARGUMENT) {
      stack.push(args[node.value])
    } else if (node.type === Operation.CONSTANT) {
      stack.push(node.value)
    } else if (node.type === Operation.CONJUNCTION) {
      const result = stack.reduce((prev, curr) => prev && curr, stack.shift()!)
      stack = []
      stack.push(result)
    } else {
      // node.type === Operation.DISJUNCTION
      const result = stack.reduce((prev, curr) => prev || curr, stack.shift()!)
      stack = []
      stack.push(result)
    }
  }

  return stack.pop()!
}

export function PostfixEvaluator(props: {
  args: Args
  binaryExpressionTreeNodesPostOrder: BinaryExpressionTreeNodeType<
    Set<BinaryExpressionTreeNodeIdType>
  >[]
}): JSX.Element {
  const operationResult = String(
    evaluateOperation(props.binaryExpressionTreeNodesPostOrder, props.args)
  )

  return <p>{operationResult}</p>
}
