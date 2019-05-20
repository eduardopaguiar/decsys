import React from "react";
import { storiesOf } from "@storybook/react";
import SurveyPage from "./SurveyPage";
import { action } from "@storybook/addon-actions";

const page = {
  id: 1,
  components: [
    {
      id: 1,
      type: "heading",
      params: {
        text: "Hello there"
      }
    },
    {
      id: 2,
      type: "paragraph",
      params: {
        text: `Let's have some information text here for you to read...
        
![](https://cataas.com/cat)`
      }
    }
  ]
};

const actions = {
  logEvent: action("Event logged"),
  onNextPage: action("Next Button clicked")
};

storiesOf("Survey/SurveyPage", module)
  .add("Empty", () => (
    <SurveyPage page={{ id: 1, components: [] }} {...actions} />
  ))
  .add("Content", () => <SurveyPage page={page} {...actions} />);