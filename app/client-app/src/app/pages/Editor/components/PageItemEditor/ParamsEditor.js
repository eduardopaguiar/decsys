import React from "react";
import Param from "./Param";
import { Grid, Text } from "@chakra-ui/core";

// TODO: move to ParamTypes?
const convertArrayShorthands = (arr) => {
  if (!Array.isArray(arr)) return arr;

  let [type, label, defaultValue, oneOf] = arr;

  // special cases
  if (type === "string") defaultValue = defaultValue || "";
  if (type === "string?") type = "string";

  return {
    type,
    label,
    defaultValue,
    oneOf,
  };
};
const convertStringShorthands = (type) => {
  if (typeof type !== "string") return type;

  return convertArrayShorthands([type]);
};

const ParamsEditor = ({ component, params, handleParamChange }) => {
  if (!component) return null;

  const list = [];
  for (const key in component.paramTypes) {
    let pt = component.paramTypes[key];
    if (!pt) continue;

    // we now care about what type of paramTypes entry this is

    // we do some non destructive shorthand conversion attempts
    pt = convertStringShorthands(pt);
    pt = convertArrayShorthands(pt);

    // if we're here, pt is a full ParamTypes object, or invalid ¯\_(ツ)_/¯

    list.push([
      <Text key={`${key}-label`} textAlign="right" fontWeight="bold">
        {pt.label || key}
      </Text>,
      <Param
        key={`${key}-value`}
        value={params?.[key] || pt.defaultValue}
        type={pt.type}
        paramKey={key}
        oneOf={pt.oneOf}
        onChange={handleParamChange}
      />,
    ]);
  }

  return (
    <Grid
      templateColumns="2fr 5fr"
      gap={2}
      alignItems="center"
      width="100%"
      p={2}
    >
      {list}
    </Grid>
  );
};

export default ParamsEditor;
