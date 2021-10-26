import React from 'react'

import type { Args, IArgsChange } from './App'

const ArgEntry = (onArgsChange: (changedArgs: IArgsChange) => void) => ([argName, argValue]: [string, boolean], idx: number): JSX.Element => {
  const onArgValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => onArgsChange({ 
    old: {
      name: argName,
      value: argValue
    },
    new: {
      name: argName,
      value: e.target.value === 'true'
    }
  })
  
  const onArgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.trim()) {
      // Do not allow empty arg names.
      return
    }

    onArgsChange({ 
      old: {
        name: argName,
        value: argValue
      },
      new: {
        name: e.target.value.trim(),
        value: argValue
      }
    })
  }

  return (
    <section key={idx}>
      <input type="name" value={argName} onChange={onArgNameChange} />
      <select onChange={onArgValueChange} defaultValue={String(argValue)}>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    </section>
  )
}

export default function ArgsBuilder(props: {
  args: Args,
  onArgsChange: (changedArgs: IArgsChange) => void
}): JSX.Element {
  console.log(props.args)
  const createNewArg = () => props.onArgsChange({
    old: {},
    new: {
      name: `newArg${Object.keys(props.args).length}`,
      value: false
    }
  })

  return (
    <form>
      {
        Object.entries(props.args).map(ArgEntry(props.onArgsChange)) 
      }
  
      <button type="button" onClick={createNewArg}>
        + add arg
      </button>
    </form>
  )
}