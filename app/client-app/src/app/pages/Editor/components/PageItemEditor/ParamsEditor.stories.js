import React from "react";
import ParamsEditor from "./ParamsEditor";

const Component = ({ text }) => <div>{text}</div>;
Component.paramTypes = {
  param1: "string",
  param2: "number",
  group1: {
    type: "group",
    label: "Fully Specified Group",
    paramTypes: {
      groupParam1: "string",
      groupParam2: "bool",
    },
  },
  shorthandGroup: {
    groupParam1: "number",
    groupParam2: "string",
    subGroup: {
      type: "group",
      paramTypes: { subParam1: ["oneOf", null, "Bread", ["Bread", "Water"]] },
    },
  },

  //TODO:
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
  },
};

const Template = (args) => <ParamsEditor {...args} />;

export const Basic = Template.bind({});

export const ObjectLiterals = Template.bind({});
ObjectLiterals.args = {
  component: {
    ...Component.bind({}),
    paramTypes: {
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
    },
  },
};

export const StringShorthands = Template.bind({});
StringShorthands.args = {
  component: {
    ...Component.bind({}),
    paramTypes: {
      shorthandText: "string",
      shorthandTextUndefined: "string?",
      shorthandNumber: "number",
      shorthandBool: "bool",
      // `oneOf` is impossible as it requires more information
    },
  },
};

export const ArrayShorthands = Template.bind({});
ArrayShorthands.args = {
  component: {
    ...Component.bind({}),
    paramTypes: {
      arrText: ["string", "Array Shorthand Text", "default"],
      arrTextUndefined: ["string?", "Array Shorthand Text (Undefined)"],
      arrNumber: ["number", "Array Shorthand Number", 77],
      arrBool: ["bool", "Array Shorthand Bool"],
      arrOneOf: ["oneOf", "Array Shorthand OneOf", "Ham", ["Ham", "Cheese"]],
    },
  },
};

export const OneSectionOnly = Template.bind({});
OneSectionOnly.args = {
  component: {
    ...Component.bind({}),
    paramTypes: {
      "Section 1": {
        type: "section",
        paramTypes: {
          section1Param: "string",
        },
      },
    },
  },
};

export const OneSectionPlusUnparented = Template.bind({});
OneSectionPlusUnparented.args = {
  component: {
    ...Component.bind({}),
    paramTypes: {
      unparentedParam: "string",
      ...OneSectionOnly.args.component.paramTypes,
    },
  },
};

export const MultipleSections = Template.bind({});
MultipleSections.args = {
  component: {
    ...Component.bind({}),
    paramTypes: {
      ...OneSectionOnly.args.component.paramTypes,
      "Section 2": {
        type: "section",
        paramTypes: {
          section2Param: "bool",
        },
      },
    },
  },
};

export const MultipleSectionsPlusUnparented = Template.bind({});
MultipleSectionsPlusUnparented.args = {
  component: {
    ...Component.bind({}),
    paramTypes: {
      unparentedParam: "string",
      ...MultipleSections.args.component.paramTypes,
    },
  },
};

export const Groups = Template.bind({});
Groups.args = {
  component: {
    ...Component.bind({}),
    paramTypes: {
      param1: "string",
      group1: {
        type: "group",
        label: "Fully Specified Group",
        paramTypes: {
          groupParam1: "string",
          groupParam2: "bool",
        },
      },
      shorthandGroup: {
        groupParam1: "number",
        subGroup: {
          type: "group",
          paramTypes: {
            subParam1: ["oneOf", null, "Bread", ["Bread", "Water"]],
          },
        },
      },
    },
  },
};
