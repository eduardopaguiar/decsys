import * as types from "./types";
import * as constructors from "./constructors";
import { simpleTypeCheck } from "./helpers";
import { ParamTypeBuilder } from "./builders";

const validStringShorthandTypes = [
  types.string,
  types.stringUndefined,
  types.number,
  types.bool,
];

export const stringShorthand = (s) => {
  if (typeof s !== "string") throw new TypeError("Expected a string");
  if (!validStringShorthandTypes.includes(s)) {
    throw new Error(
      `String '${s}' doesn't match a ParamType that supports string shorthand construction`
    );
  }
  // handle special cases
  if (s === types.stringUndefined) return constructors.stringUndefined();

  // otherwise, where the export name matches the type value
  return constructors[s]();
};

/**
 * Convert an array of positional arguments to a ParamType.
 * @param {[]} a ParamType constructor arguments.
 * The first argument is always `type`. Refer to type specific documentation for the rest.
 */
export const arrayShorthand = (a) => {
  simpleTypeCheck(a, "array");
  const [type, label, value, options = {}] = a;

  // handle special cases, simplifies parsing/validation
  switch (type) {
    case types.array:
      return constructors.array(label, value, options);
    case types.oneOf:
      return constructors.oneOf(label, value, options);
    default:
      return ParamTypeBuilder.fromObject({
        type,
        label,
        defaultValue: value,
        ...options,
      });
  }
};

/**
 * Convert an object literal to a ParamType.
 * - Objects with no `type` property become a Group Param with children as types?
 * - Objects with a `type` property are validated and constructed as a ParamType.
 * @param {*} o
 */
export const objectShorthand = (o) => {
  // TODO: Object (but not function!) test?
  simpleTypeCheck(o, "object");

  if (!o.type) {
    // TODO: consider nesting, using GroupParamBuilder
    o = {
      type: types.group,
      paramTypes: o,
    };
  }

  return ParamTypeBuilder.fromObject(o);
};

/**
 * typechecks the input and, if possible,
 * tries to convert it to a ParamType from any possible source format.
 * @param {*} paramType ParamType source as a string, array, or object literal.
 */
export const convertShorthands = (paramType) => {
  switch (typeof paramType) {
    case "string":
      return stringShorthand(paramType);
    case "object":
      return objectShorthand(paramType);
    default: {
      if (Array.isArray(paramType)) {
        return arrayShorthand(paramType);
      } else {
        throw new Error(
          `'paramType' could not be converted to a ParamType from ${typeof paramType}: '${paramType}'`
        );
      }
    }
  }
};
