import React from "react";
import ArgsBuilder from "./ArgsBuilder";
import type { Args } from "./ArgsBuilder";
import { renameArgsKeysInPlace } from "./renameArgsKeysInPlace";
import { OperationBuilder } from "./OperationBuilder";
import BinaryExpressionTreeProvider, { useBinaryExpressionTree } from "./BinaryExpressionTreeProvider";
import { PostfixEvaluator } from "./PostfixEvaluator";

export interface IArgsChange {
  old: {
    name?: string,
    value?: boolean
  },
  new: {
    name: string,
    value: boolean
  }
}

export default function App() {
  const [args, setArgs] = React.useState<Args>({})
  const binaryExpressionTree = useBinaryExpressionTree()
  const [binaryExpressionTreeNodes, setBinaryExpressionTreeNodes] = React.useState(Array.from(binaryExpressionTree.traversalDFS(binaryExpressionTree.getRootId())))
  const [binaryExpressionTreeNodesPostOrder, setBinaryExpressionTreeNodesPostOrder] = React.useState(Array.from(binaryExpressionTree.traversalPostOrder(binaryExpressionTree.getRootId())))


  const updateBinaryExpressionTreeNodes = () => {
    setBinaryExpressionTreeNodes(
      Array.from(binaryExpressionTree.traversalDFS(binaryExpressionTree.getRootId()))
    )

    setBinaryExpressionTreeNodesPostOrder(
      Array.from(binaryExpressionTree.traversalPostOrder(binaryExpressionTree.getRootId()))
    )
  }

  const onArgsChange = (changedArgs: IArgsChange) => {
    if (!changedArgs.old.name) { // change reflects new arg addition
      setArgs({
        ...args,
        [changedArgs.new.name]: changedArgs.new.value
      })
    } else if (changedArgs.new.name !== changedArgs.old.name) { // change reflects existing arg name change
      // Use renameObjectKeysInPlace to keep the same insertion order of the keys in the
      // args object, thus render the the args GUI in the same order every time.
      setArgs(
        renameArgsKeysInPlace(args, {
          [changedArgs.old.name]: changedArgs.new.name
        })
      )
    } else { // change reflects existing arg value change
      setArgs({
        ...args,
        [changedArgs.old.name.trim()]: changedArgs.new.value
      })
    }
  }

  return (
    <BinaryExpressionTreeProvider>
      <div>
        <ArgsBuilder args={args} onArgsChange={onArgsChange} />
        <OperationBuilder args={args} 
        binaryExpressionTreeNodes={binaryExpressionTreeNodes}
        updateBinaryExpressionTreeNodes={updateBinaryExpressionTreeNodes}
        binaryExpressionTree={binaryExpressionTree}/>
        <PostfixEvaluator  binaryExpressionTreeNodesPostOrder={binaryExpressionTreeNodesPostOrder} args={args}/>
      </div>
    </BinaryExpressionTreeProvider>
  );
}
