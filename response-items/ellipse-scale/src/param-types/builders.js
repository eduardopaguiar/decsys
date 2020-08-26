// Ok, so here's the plan
// All other APIs resolve to builders
// Builders have `with<Option>` extensions for every option
//   this helps define the available options for a type
//   and is a single place to vaildate them
// Constructors require arguments for required options
// All builders override `withOptions` and extract the options they care about
// then set them using the dedicated `with<Option>` call, which performs the validation
// Shorthand conversions, including from object literals, run through builders so tehy are validated.

import { simpleTypeCheck } from "./helpers";
import * as types from "./types";
import { convertShorthands } from "./converters";

export class ParamTypeBuilder {
  constructor(type) {
    if (!Object.keys(types).some((k) => types[k] === type))
      throw new Error(`Invalid Param Type: ${type}`);

    // arguably convert helper types, in case they're used
    if (type === types.stringUndefined) type = types.string;

    this.paramType = { type };
  }

  withDefault(defaultValue) {
    // TODO: Type Validation?
    this.paramType.defaultValue = defaultValue;
    return this;
  }

  withLabel(label) {
    simpleTypeCheck(label, "string", "label");
    this.paramType.label = label;
    return this;
  }

  withPath(path) {
    simpleTypeCheck(path, "string", "path");
    this.paramType.path = path;
    return this;
  }

  withInfo(info) {
    simpleTypeCheck(info, "string", "info");
    this.paramType.info = info;
    return this;
  }

  /** Add standard options passed */
  withOptions({ path, label, defaultValue, info }) {
    path != null && this.withPath(path);
    label != null && this.withLabel(label);
    defaultValue != null && this.withDefault(defaultValue);
    info != null && this.withInfo(info);

    return this;
  }

  merge(obj) {
    // TODO: lodash merge
    this.paramType = this.fromObject(
      //merge({}, this.paramType, obj)
      { ...this.paramType, ...obj }
    );
  }

  static fromObject({ type, ...obj }) {
    switch (type) {
      case types.string:
        return new StringParamBuilder().withOptions(obj);
      case types.number:
        return new NumberParamBuilder().withOptions(obj);
      case types.bool:
        return new BoolParamBuilder().withOptions(obj);
      case types.oneOf:
        return new OneOfParamBuilder(obj.oneOf, obj.defaultValue).withOptions(
          obj
        );
      default:
        throw new Error(`Invalid Param Type: ${type}`);
    }
  }

  build() {
    return this.fromObject(this.paramType);
  }
}

export class StringParamBuilder extends ParamTypeBuilder {
  constructor() {
    super(types.string);
  }

  withLimit(limit) {
    simpleTypeCheck(limit, "number", "limit");
    this.paramType.limit = limit;
    return this;
  }

  withOptions({ limit, ...options }) {
    limit != null && this.withLimit(limit);
    super.withOptions(options);
    return this;
  }
}

export class NumberParamBuilder extends ParamTypeBuilder {
  constructor() {
    super(types.number);
  }

  withMin(min) {
    simpleTypeCheck(min, "number", "min");
    this.paramType.min = min;
    return this;
  }

  withMax(max) {
    simpleTypeCheck(max, "number", "max");
    this.paramType.max = max;
    return this;
  }

  withRange(min, max) {
    return this.withMin(min).withMax(max);
  }

  withOptions({ min, max, ...options }) {
    min != null && this.withMin(min);
    max != null && this.withMax(max);
    super.withOptions(options);
    return this;
  }
}

export class BoolParamBuilder extends ParamTypeBuilder {
  constructor() {
    super(types.bool);
  }
  // No non-standard options
}

/**
 * Build a `oneOf` Param progressively.
 */
export class OneOfParamBuilder extends ParamTypeBuilder {
  /**
   *
   * @param {[]} validValues Hello
   * @param {*} defaultValue
   */
  constructor(validValues, defaultValue) {
    super(types.oneOf);
    this.withOneOf(validValues).withDefault(defaultValue);
  }

  withOneOf(validValues) {
    simpleTypeCheck(validValues, "array", "validValues");
    // TODO: check type homogeny?
    if (validValues.length < 2)
      console.warn(
        "oneOf Param: expected at least 2 values to choose between."
      );
    this.paramType.validValues = validValues;
    return this;
  }

  withDefault(defaultValue) {
    if (!this.paramType.validValues.includes())
      throw new Error(
        "oneOf Param: expected 'defaultValue' to be one of the valid values."
      );
    return super.withDefault(defaultValue);
  }

  withOptions({ oneOf, defaultValue, ...options }) {
    defaultValue != null && this.withDefault(defaultValue);
    oneOf != null && this.withOneOf(oneOf);
    super.withOptions(options);
    return this;
  }
}

export class ArrayParamBuilder extends ParamTypeBuilder {
  constructor(childType) {
    super(types.array);
    this.withChildType(childType);
  }

  withChildType(childType) {
    this.paramType.childType = convertShorthands(childType);
    return this;
  }

  withLimit(limit) {
    simpleTypeCheck(limit, "number", "limit");
    this.paramType.limit = limit;
    return this;
  }

  withOptions({ childType, limit, ...options }) {
    childType != null && this.withChildType(childType);
    limit != null && this.withLimit(limit);
    super.withOptions(options);
    return this;
  }
}

export class GroupParamBuilder extends ParamTypeBuilder {
  constructor(children) {
    super(types.group);
    this.withParamTypes(children);
  }

  withParamTypes(children) {
    simpleTypeCheck(children, "object", "children");
    this.paramType.children = Object.keys(children).reduce(
      (children, k) => ({
        ...children,
        [k]: convertShorthands(children[k]),
      }),
      {}
    );
    return this;
  }

  withFlatPaths(useFlatPaths) {
    this.paramType.flatPaths = useFlatPaths;
    return this;
  }

  withOptions({ paramTypes, flatPaths, ...options }) {
    paramTypes != null && this.withParamTypes(paramTypes);
    flatPaths != null && this.withFlatPaths(flatPaths);
    super.withOptions(options);
    return this;
  }
}

export class SectionParamBuilder extends ParamTypeBuilder {
  constructor(children) {
    super(types.section);
    this.withParamTypes(children);
  }

  withParamTypes(children) {
    simpleTypeCheck(children, "object", "children");
    this.paramType.children = Object.keys(children).reduce(
      (children, k) => ({
        ...children,
        [k]: convertShorthands(children[k]),
      }),
      {}
    );
    return this;
  }

  withOptions({ paramTypes, flatPaths, ...options }) {
    paramTypes != null && this.withParamTypes(paramTypes);
    super.withOptions(options);
    return this;
  }
}
