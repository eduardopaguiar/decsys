import base64url from "base64url";

/**
 * Returns an array of keys which have truthy, or falsey values in an object
 * @param {Object} o the object to find truthy or falsey keys in
 * @param {boolean} [truthy] whether to look for truthy or falsey values. Defaults to truthy.
 */
export const listMatchingKeys = (o, truthy = true) =>
  Object.keys(o).filter((k) => !!o[k] === truthy);

/**
 * Reduce an array of objects to a keyed dictionary of those objects
 * in the form
 * ```
 *     {
 *         [object[keyProp]]: object
 *         ...
 *     }
 * ```
 * @param {object[]} data a list of objects
 * @param {any} [keyProp] the property of each object to use as a unique dictionary key.
 *
 * defaults to `"id"`
 */
export const toDictionary = (data, keyProp = "id") =>
  // TODO: make this even more like C#'s `Enumerable.ToDictionary()`
  data.reduce((acc, datum) => {
    acc[datum[keyProp]] = datum;
    return acc;
  }, {});

/**
 * Is an Object empty?
 * @param {Object} obj
 */
export const isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const Base64UrlToUtf8 = (input) =>
  (!!input && base64url.decode(input)) || null;

/**
 * Follow a string path in dot notation
 * to a nested child on an object or array.
 * - integer path segments are array index accessors
 * - string path segments are object index accessors
 * @param {*} source the object to apply the path to.
 * @param {*} path the path to follow
 */
export const getNestedChild = (source, path) => {
  if (source == null) return null;
  if (!Array.isArray(source) || typeof source !== "object") {
    // TODO: functions should work too
    throw new Error(
      `Can only access children of arrays or objects. Provided source was ${typeof source}`
    );
  }

  // parse the path
  const segments = path.split(".");

  // drill down to the child (null coalescing on the way)
  let result = source;
  for (const key of segments) {
    const intKey = parseInt(key);
    result = result?.[!isNaN(intKey) ? intKey : key];
  }

  return result;
};

export const setNestedChild = (source, path, value) => {
  if (source == null) return null;
  if (!Array.isArray(source) || typeof source !== "object") {
    // TODO: functions should work too
    throw new Error(
      `Can only access children of arrays or objects. Provided source was ${typeof source}`
    );
  }

  // parse the path
  const segments = path.split(".");

  // drill down to the just before the child
  let parent = source;
  for (let i = 0; i < segments.length - 1; i++) {
    const intKey = parseInt(segments[i]);
    const key = !isNaN(intKey) ? intKey : segments[i];

    // create non-existent steps on the path
    const nextParent = parent[key];
    if (!nextParent) {
      if (!isNaN(intKey)) parent[key] = [];
      else parent[key] = {};
    }

    parent = parent[key];
  }

  parent[segments[segments.length - 1]] = value;
};
