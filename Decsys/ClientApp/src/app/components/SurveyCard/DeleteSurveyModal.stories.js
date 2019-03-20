import React from "react";
import { storiesOf } from "@storybook/react";
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import DeleteSurveyModal from "./DeleteSurveyModal";

storiesOf("Admin/SurveyCard/DeleteSurveyModal", module).add("Default", () => (
  <DeleteSurveyModal
    surveyName={text("Survey name", "My First Survey")}
    modalOpened={true}
    deleteSurvey={action("Delete clicked")}
    closeModal={action("Modal closed")}
  />
));