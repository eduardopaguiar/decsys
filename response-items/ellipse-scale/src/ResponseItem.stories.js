import React from "react";
import { action } from "@storybook/addon-actions";
import ResponseItem from "./ResponseItem";
import { Icon } from "./metadata";

const _context = {
  setNextEnabled: () => {}, //action("Next button toggled"),
  logResults: () => {}, //action("Results logged"),
};

/** For Storybook 6 args */
const buildArgTypes = (params) =>
  Object.keys(params).reduce((result, paramKey) => {
    const { type, label: description, defaultValue } = params[paramKey];
    return {
      ...result,
      [paramKey]: {
        type,
        description,
        defaultValue,
        table: {
          type: { summary: type },
          defaultValue: { summary: defaultValue },
        },
      },
    };
  }, {});

export default {
  title: "Response",
  component: ResponseItem,
  //argTypes: buildArgTypes(ResponseItem.params),
};

export const Basic = (args) => <ResponseItem {...args} _context={_context} />;

// const props = {
//   barLeftMargin: 10,
//   barTopMargin: 50,
//   barRightMargin: 10,
//   barThickness: 8,
//   barMaxValue: 100,
//   barMinValue: 0,
// };

// const dummyEllipseResults = [
//   {
//     minRangeValue: 60,
//     maxRangeValue: 90,
//     completed: true,
//   },
//   {
//     minRangeValue: 0,
//     maxRangeValue: 100,
//     completed: true,
//   },
//   {
//     minRangeValue: 50,
//     maxRangeValue: 90,
//     completed: true,
//   },
//   {
//     minRangeValue: 40,
//     maxRangeValue: 90,
//     completed: true,
//   },
//   {
//     minRangeValue: 80,
//     maxRangeValue: 90,
//     completed: true,
//   },
// ];

// const visualization = (stats) => () => (
//   <div style={{ marginLeft: "3em", width: "40%" }}>
//     {stats.visualizations[0].component}
//   </div>
// );

// const stats = (stats) => () => (
//   <div>
//     {Object.keys(stats.stats).map((x) => (
//       <div key={x}>
//         <h4>{x}</h4>
//         <p>{stats.stats[x]}</p>
//       </div>
//     ))}
//   </div>
// );

// export const NumericVisualisation = visualization(
//   ResponseItem.stats(
//     { ...ResponseItem.defaultProps, ...props },
//     dummyEllipseResults
//   )
// );

// export const NumericStats = stats(
//   ResponseItem.stats(
//     { ...ResponseItem.defaultProps, ...props },
//     dummyEllipseResults
//   )
// );

export const MetadataIcon = () => <Icon width="24px" />;
