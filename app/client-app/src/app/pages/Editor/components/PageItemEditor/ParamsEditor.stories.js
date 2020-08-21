import React from "react";
import ParamsEditor from "./ParamsEditor";

const Component = ({ text }) => <div>{text}</div>;
Component.paramTypes = {
  numberMin: {
    type: "number",
    min: 7,
  },
  numberMax: {
    type: "number",
    max: 20,
  },
  numberRange: {
    type: "number",
    min: 0,
    max: 100,
  },
  numberOptions: ["number", null, 0, { min: 0, max: 10 }],
  stringLength: {
    type: "string",
    limit: 5000,
  },
  stringOptions: ["string", null, "", { limit: 10 }],
  arrayLimit: {
    type: "array",
    childType: "string",
    limit: 3,
  },
  arrayOptions: ["array", "Shorthand Array", "string", { limit: 4 }],
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
        label: "Group with Flat Paths",
        flatPaths: true,
        paramTypes: {
          groupParam1: "string",
          groupParam2: "bool",
        },
      },
      shorthandGroup: {
        groupParam1: {
          type: "number",
          label: "Overridden Path",
          path: "overridden.path",
        },
        subGroup: {
          type: "group",
          paramTypes: {
            subParam1: [
              "oneOf",
              "Default Nested Path",
              "Bread",
              ["Bread", "Water"],
            ],
          },
        },
      },
    },
  },
};

export const Arrays = Template.bind({});
Arrays.args = {
  component: {
    ...Component.bind({}),
    paramTypes: {
      Primitives: {
        type: "section",
        paramTypes: {
          param1: "string",
          strings: {
            type: "array",
            childType: "string",
          },
          numbers: {
            type: "array",
            childType: "number",
          },
          bools: {
            type: "array",
            childType: "bool",
          },
          oneOfs: {
            type: "array",
            childType: ["oneOf", "Animal", "Horse", ["Horse", "Duck"]],
          },
        },
      },

      groups: {
        type: "array",
        childType: {
          type: "group",
          label: "Group",
          paramTypes: {
            param: "string",
            subGroup: {
              subParam: "number",
            },
          },
        },
      },
      groupsWithArrays: {
        type: "array",
        path: "test",
        childType: {
          type: "group",

          paramTypes: {
            string: { type: "string", path: "yes" },
            strings: {
              type: "array",
              path: "lol",
              childType: { type: "string" },
            },
          },
        },
      },
      arrays: {
        type: "array",
        childType: {
          type: "array",
          childType: {
            type: "array",
            childType: {
              type: "array",
              childType: "string",
            },
          },
        },
      },
    },
  },
};

export const WithInfo = Template.bind({});
WithInfo.args = {
  component: {
    ...Component.bind({}),
    paramTypes: {
      withTooltip: {
        type: "string",
        info: "Some kind of text parameter",
      },
      groupTooltips: {
        type: "group",
        info: "The group",
        paramTypes: {
          child: {
            type: "string",
            info: "the child",
          },
          noTooltip: {
            type: "string",
          },
        },
      },
      arrayTooltips: {
        type: "array",
        info: "the array",
        childType: {
          type: "string",
          info: "a child",
        },
      },
    },
  },
};

export const ColorPicker = Template.bind({});
ColorPicker.args = {
  component: {
    ...Component.bind({}),
    paramTypes: {
      colors: {
        type: "array",
        childType: "color",
      },
    },
  },
};
