import React from "react";
import ParamsEditor from "./ParamsEditor";

const Component = ({ text }) => <div>{text}</div>;
Component.paramTypes = {
  // object literal form
  text: {
    type: "string",
    defaultValue: "lol",
  },
  isBoolean: {
    type: "bool",
    label: "Is Boolean?",
  },
  howMany: {
    type: "number",
    label: "How Many?",
  },
  chooseOne: {
    type: "oneOf",
    label: "Choose One",
    oneOf: ["Ham", "Cheese"],
  },
  // string shorthands
  shorthandText: "string",
  shorthandTextUndefined: "string?",
  shorthandNumber: "number",
  shorthandBool: "bool",
  // array shorthands
  arrText: ["string", "Array Shorthand Text", "default"],
  arrTextUndefined: ["string?", "Array Shorthand Text (Undefined)"],
  arrNumber: ["number", "Array Shorthand Number", 77],
  arrBool: ["bool", "Array Shorthand Bool"],
  arrOneOf: ["oneOf", "Array Shorthand OneOf", "Ham", ["Ham", "Cheese"]],
  // or use ParamTypes builders <3

  // array: {
  //   type: "array",
  // },
};

export default {
  title: "ParamsEditor",
  component: ParamsEditor,
  argTypes: {
    handleParamChange: { action: "changed" },
  },
  args: {
    component: Component,
    params: { isBoolean: false },
  },
};

export const Basic = (args) => <ParamsEditor {...args} />;
