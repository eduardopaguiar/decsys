export const simpleTypeCheck = (arg, typeName, argName) => {
  // some types have special checks
  let valid;
  switch (typeName) {
    case "array":
      valid = Array.isArray(arg);
      break;
    // TODO: function
    default:
      valid = typeof arg === typeName;
  }

  if (!valid)
    throw new TypeError(
      `Expected ${
        argName && `'${argName}' to be `
      }of type '${typeName}', but got ${typeof arg}: '${arg}'`
    );
};
