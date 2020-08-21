// TODO: move to ParamTypes package?

// TODO: use types enum

export const convertArrayShorthands = (arr) => {
  if (!Array.isArray(arr)) return arr;

  let [type, label, defaultValue, oneOf] = arr;

  // special cases
  // TODO: this is broken, what is its use case?
  // broken by setting defaults below after turning it into string
  // but i'd like to remove it if it's not needed
  if (type === "string?") type = "string";

  return {
    type,
    label,
    defaultValue,
    oneOf,
  };
};

export const convertStringShorthands = (type) =>
  typeof type !== "string" ? type : convertArrayShorthands([type]);

export const convertShorthands = (paramType) => {
  paramType = convertStringShorthands(paramType);
  paramType = convertArrayShorthands(paramType);

  // convert object (group type) shorthands
  if (!paramType.type) {
    paramType = { type: "group", paramTypes: paramType };
  }
  return paramType;
};
