import type { Args } from "./ArgsBuilder";

// NOTE: For some reason react typescript is not being able to parse this Typescript
// syntax. To review it, uncomment the following line.
// type MappedObjectNamesType<T> = {[argName in keyof T]: string}

export function renameArgsKeysInPlace<T>(obj: Args, newKeys: /*MappedObjectNamesType<Args>*/ {[key: string]: string}): Args {
  const keyValues = Object.keys(obj).map(key => (
    { [key in newKeys ? newKeys[key] : key]: obj[key] }
  ));

  return Object.assign({}, ...keyValues);
}
