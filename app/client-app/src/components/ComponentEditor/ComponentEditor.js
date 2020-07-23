import React from "react";
import Param from "./Param";
import { Grid } from "styled-css-grid";
import { Typography } from "@smooth-ui/core-sc";

const ComponentEditor = ({ component, params, onChange }) => {
  if (!component) return null;

  const list = [];
  for (const key in component.params) {
    const p = component.params[key];
    list.push([
      <Typography key={`${key}-label`} textAlign="right" fontWeight="bold">
        {p.label}
      </Typography>,
      <Param
        key={`${key}-value`}
        value={params[key] || p.defaultValue}
        type={p.type}
        paramKey={key}
        oneOf={p.oneOf}
        onChange={onChange}
      />
    ]);
  }

  return (
    <Grid columns="2fr 5fr" rowGap=".2em">
      {list}
    </Grid>
  );
};

export default ComponentEditor;