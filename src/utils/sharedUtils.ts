export const formatDate = (value: string | Date) => {
  if (value instanceof Date) {
    return `${value.getDay()}/${value.getMonth()}/${value.getFullYear()} ${value.getHours()}:${value.getMinutes()}`;
  } else if (typeof value === "string") {
    const date = new Date(value);
    return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  } else {
    return value;
  }
};

export function getValueAtKeyPath(
  object: Record<string, unknown>,
  keyPath: string,
  throwIfNotFound = false
): unknown {
  const split = keyPath.split(".");

  return split.reduce((previous: unknown, current, i, arr) => {
    if (typeof previous !== "object" || previous === null) {
      if (throwIfNotFound) {
        console.error("input object", object);
        console.error("key path", keyPath);
        throw new Error(
          "can get value at a key path that which has a non object value in the path"
        );
      } else {
        arr.splice(1); // eject from the reduce
        return null;
      }
    }
    return (previous as Record<string, unknown>)[current];
  }, object);
}

export function setValueAtKeyPath(
  object: Record<string, unknown>,
  keyPath: string,
  value: unknown
): void {
  const keys = keyPath.split(".");
  let ref = object;
  keys.forEach((key, i) => {
    // if this is the last key, assign the key to the value
    if (i === keys.length - 1) {
      ref[key] = value;
    } else {
      // if the key on the object is undefined or null, assign object
      if (object[key] === undefined || object[key] === null) {
        object[key] = {};
      }

      // hold a reference to the current path on object
      ref = object[key] as Record<string, unknown>;
    }
  });
}
