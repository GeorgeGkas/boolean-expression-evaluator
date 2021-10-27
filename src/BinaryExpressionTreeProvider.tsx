import React from 'react'
import { BinaryExpressionTree } from './BinaryExpressionTree'

const BinaryExpressionTreeContext = React.createContext<BinaryExpressionTree>(
  new BinaryExpressionTree()
)

const BinaryExpressionTreeProvider = (props: React.PropsWithChildren<any>) => (
  <BinaryExpressionTreeContext.Provider value={new BinaryExpressionTree()}>
    {props.children}
  </BinaryExpressionTreeContext.Provider>
)

const useBinaryExpressionTree = () =>
  React.useContext<BinaryExpressionTree>(BinaryExpressionTreeContext)

export { BinaryExpressionTreeProvider as default, useBinaryExpressionTree }
