import type { Args } from './ArgsBuilder'

type MappedObjectNamesType<T> = { [argName in keyof T]: string }

export function renameArgsKeysInPlace(
  obj: Args,
  newKeys: MappedObjectNamesType<Args>
): Args {
  const keyValues = Object.keys(obj).map((key) => ({
    [key in newKeys ? newKeys[key] : key]: obj[key],
  }))

  return Object.assign({}, ...keyValues)
}
