import React from "react";
import ArgsBuilder from "./ArgsBuilder";
import type { Args } from "./ArgsBuilder";
import { renameArgsKeysInPlace } from "./renameArgsKeysInPlace";

type Operation = any; /* ...todo:
a system for defining logical operations 
(not, and, or... more if you want) that can be passed:
 - selected args by name: (X and Y)
 - constant values not dependent on args: (true and X)
 - other operations: ((X and Y) or Z) 
 */

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

function evaluateOperation(operation: Operation, args: Args): boolean {
  /* ...todo: implement an evaluator for your operations, 
  given some args */
  return true
}

function OperationBuilder(props: {
  value: Operation;
  onChange: (value: Operation) => void;
}): JSX.Element {
  /* ...todo: an ugly gui for creating operations */
  return <></>
}

export default function App() {
  const [args, setArgs] = React.useState<Args>({})

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
    <div>
      <ArgsBuilder args={args} onArgsChange={onArgsChange} />
      {/* todo: use <OperationBuilder> and have an interface
      for entering arguments and seeing the result */}
    </div>
  );
}
