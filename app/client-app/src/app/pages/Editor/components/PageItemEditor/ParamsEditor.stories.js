import React from "react";
import ParamsEditor from "./ParamsEditor";

const Component = ({ text }) => <div>{text}</div>;
Component.params = {
  text: {
    type: "string",
    label: "Text",
    defaultValue: "",
  },
};

export default {
  title: "ParamsEditor",
  component: ParamsEditor,
  argTypes: {
    handleParamChange: { action: "changed" },
  },
  args: {
    component: Component,
    params: [],
  },
};

export const Basic = (args) => <ParamsEditor {...args} />;
