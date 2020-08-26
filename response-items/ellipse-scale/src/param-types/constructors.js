import { StringParamBuilder, ParamTypeBuilder } from "./builders";
import * as types from "./types";

const stringTemplate = (label, options = {}) =>
  new StringParamBuilder().withLabel(label).withOptions(options);

export const string = (label, defaultValue = "", options = {}) =>
  stringTemplate(label, options).withDefault(defaultValue).build();

export const stringUndefined = (label, options = {}) =>
  stringTemplate(label, options).build();

export const number = (label, defaultValue = 0, options = {}) =>
  ParamTypeBuilder.fromObject({
    type: types.number,
    label,
    defaultValue,
    ...options,
  });

export const bool = (label, defaultValue) =>
  ParamTypeBuilder.fromObject({ type: types.bool, label, defaultValue });

/**
 * Construct a `oneOf` Param.
 * @param {*} label - The friendly label for this Param
 * @param {*} defaultValue The default value. MUST be one of the valid values provided in `options.oneOf`
 * @param {[]|{}} options An array of valid values to choose from, or an options dictionary.
 */
export const oneOf = (label, defaultValue, options = {}) => {
  if (Array.isArray(options)) {
    options = { oneOf: options };
  }

  return ParamTypeBuilder.fromObject({
    type: types.oneOf,
    label,
    defaultValue,
    ...options,
  });
};

export const array = (label, childType, options = {}) =>
  ParamTypeBuilder.fromObject({
    type: types.array,
    label,
    childType,
    ...options,
  });

export const group = (label, paramTypes, options = {}) =>
  ParamTypeBuilder.fromObject({
    type: types.group,
    label,
    paramTypes,
    ...options,
  });

export const section = (label, paramTypes) => {
  ParamTypeBuilder.fromObject({
    type: types.section,
    label,
    paramTypes,
  });
};
