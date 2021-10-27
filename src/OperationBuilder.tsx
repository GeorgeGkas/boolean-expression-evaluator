import React from 'react'
import { Args } from './ArgsBuilder'
import {
  BinaryExpressionTree,
  BinaryExpressionTreeNodeIdType,
  BinaryExpressionTreeNodeType,
  Operation,
} from './BinaryExpressionTree'

import './OperationBuilder.css'

const GenericOptions = (props: { args: Args }) => (
  <>
    <option value={Operation.GENERIC}>select...</option>
    <option value={Operation.CONSTANT}>constant</option>
    {Object.keys(props.args).length && (
      <option value={Operation.ARGUMENT}>argument</option>
    )}
    <option value={Operation.CONJUNCTION}>and</option>
    <option value={Operation.DISJUNCTION}>or</option>
  </>
)
const ConstantOptions = () => (
  <>
    <option value={`${Operation.CONSTANT}-true`}>true</option>
    <option value={`${Operation.CONSTANT}-false`}>false</option>
  </>
)

const DisjunctionOptions = () => (
  <>
    <option value={Operation.CONJUNCTION}>and</option>
    <option value={Operation.DISJUNCTION}>or</option>
  </>
)

const ConjunctionOptions = DisjunctionOptions

const ArgsOptions = (props: { args: Args }) => {
  return (
    <>
      {Object.entries(props.args).map(([argName], id) => (
        <option key={id} value={`${Operation.ARGUMENT}-${argName}`}>
          {argName}
        </option>
      ))}
    </>
  )
}

const BuildOperationOptions = (props: {
  type: Operation
  args: Args
}): JSX.Element => {
  return {
    [Operation.GENERIC]: <GenericOptions args={props.args} />,
    [Operation.CONSTANT]: <ConstantOptions />,
    [Operation.ARGUMENT]: <ArgsOptions args={props.args} />,
    [Operation.CONJUNCTION]: <ConjunctionOptions />,
    [Operation.DISJUNCTION]: <DisjunctionOptions />,
  }[props.type]
}

const normalizeNodeValue = (
  type: Operation,
  value: string | boolean | Set<BinaryExpressionTreeNodeIdType>,
  args: Args
) => {
  console.log(value)
  if (typeof value === 'object') {
    if (type === Operation.CONJUNCTION) {
      return Operation.CONJUNCTION
    } else {
      return Operation.DISJUNCTION
    }
  } else if (typeof value === 'string') {
    return `${Operation.ARGUMENT}-${value}`
  } else {
    return `${Operation.CONSTANT}-${value}`
  }
}

export function OperationBuilder(props: {
  args: Args
  binaryExpressionTreeNodes: BinaryExpressionTreeNodeType<
    Set<BinaryExpressionTreeNodeIdType>
  >[]
  binaryExpressionTree: BinaryExpressionTree
  updateBinaryExpressionTreeNodes: () => any
}): JSX.Element {
  const isNodeTypeConjunctionOrDisjunction = (type: Operation) =>
    type === Operation.CONJUNCTION || type === Operation.DISJUNCTION
  const changeNodeType =
    (nodeId: BinaryExpressionTreeNodeIdType) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const targetValue = e.target.value

      let normalizedType: Operation
      let normalizedValue: string | undefined | boolean

      if (targetValue.startsWith(Operation.DISJUNCTION)) {
        normalizedType = Operation.DISJUNCTION
      } else if (targetValue.startsWith(Operation.CONJUNCTION)) {
        normalizedType = Operation.CONJUNCTION
      } else if (targetValue.startsWith(Operation.ARGUMENT)) {
        normalizedType = Operation.ARGUMENT
        normalizedValue = targetValue.split('-').pop()!
      } else if (targetValue.startsWith(Operation.CONSTANT)) {
        normalizedType = Operation.CONSTANT
        normalizedValue = targetValue.split('-').pop() === 'true'
      } else {
        // targetValue.startsWith(Operation.GENERIC)
        normalizedType = Operation.GENERIC
      }

      props.binaryExpressionTree.changeNodeTypeById(
        nodeId,
        normalizedType,
        normalizedValue
      )

      props.updateBinaryExpressionTreeNodes()
    }

  const removeNode = (nodeId: BinaryExpressionTreeNodeIdType) => () => {
    props.binaryExpressionTree.removeNodeById(nodeId)
    props.updateBinaryExpressionTreeNodes()
  }

  const addOperation = (nodeId: BinaryExpressionTreeNodeIdType) => () => {
    props.binaryExpressionTree.addChildNode(Operation.GENERIC, nodeId)
    props.updateBinaryExpressionTreeNodes()
  }

  React.useEffect(() => {
    for (const node of props.binaryExpressionTreeNodes) {
      if (
        normalizeNodeValue(node.type, node.value, props.args) ===
        'Argument-Argument'
      ) {
        props.binaryExpressionTree.changeNodeValueById(
          node.id,
          Object.keys(props.args).shift()!
        )
        props.updateBinaryExpressionTreeNodes()
        return
      }
    }
  }, [props])

  return (
    <div className="operation-builder-wrapper">
      {props.binaryExpressionTreeNodes.map((node, idx) => {
        const normalizedNodeValue = normalizeNodeValue(
          node.type,
          node.value,
          props.args
        )
        return (
          <section
            className="operation-node"
            key={idx}
            style={{
              marginLeft: `${node.level * 30}px`,
            }}>
            <div>
              <select
                value={normalizedNodeValue}
                onChange={changeNodeType(node.id)}>
                <BuildOperationOptions type={node.type} args={props.args} />
              </select>
              <button
                className="operation-node-remove-button"
                onClick={removeNode(node.id)}>
                ✖
              </button>
            </div>
            <div>
              <button
                className={`operation-node-add-op-button ${
                  !isNodeTypeConjunctionOrDisjunction(node.type) ? 'hidden' : ''
                }`}
                onClick={addOperation(node.id)}>
                + add op
              </button>
            </div>
          </section>
        )
      })}
    </div>
  )
}
