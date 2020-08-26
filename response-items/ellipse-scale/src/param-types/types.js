/** Parameter Types, and logical helper type identifiers */

/** String Param */
export const string = "string";

/** Integer Param */
export const number = "number";

/** Boolean Param */
export const bool = "bool";

/** Array of Params of a single type */
export const array = "array";

/** Enum Param. Param value must be one of the enumerated values. */
export const oneOf = "oneOf";

/**
 * Group Param.
 *
 * - Can be used as a logical grouping only (with `flatPaths` or if child paths are overridden.)
 * - Can be used to define a Dictionary Param structure.
 */
export const group = "group";

/** Helper type. Indicates a String Param with an explicitly undefined `defaultValue`  */
export const stringUndefined = "string?";

/** Helper type. Indicates a logical grouping that has no effect on the params data structure */
export const section = "section";
