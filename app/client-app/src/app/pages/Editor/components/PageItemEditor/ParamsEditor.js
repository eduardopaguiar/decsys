import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
} from "@chakra-ui/core";
import { buildControls } from "./helpers";

const EditorSections = ({ controls, ...sections }) => {
  const sectionKeys = Object.keys(sections);

  // handle 1 named section and no unparented params
  // which should be rare...
  if (!controls.length && sectionKeys.length === 1)
    return sections[sectionKeys[0]].controls;

  // multiple sections
  return (
    <Tabs size="sm" w="100%" gridColumn="span 2">
      <TabList>
        {sectionKeys.map((key) => (
          <Tab key={key}>{key}</Tab>
        ))}
        {!!controls.length && <Tab>Other</Tab>}
      </TabList>

      <TabPanels>
        {sectionKeys.map((key) => (
          <TabPanel key={key}>
            <Stack>{sections[key].controls}</Stack>
          </TabPanel>
        ))}
        {controls.length && (
          <TabPanel>
            <Stack>{controls}</Stack>
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

const ParamsEditor = ({ component, params, handleParamChange }) => {
  if (!component) return null;

  const sections = buildControls(
    { params, handleParamChange },
    component.paramTypes,
    true
  );

  return (
    <Stack>
      {Object.keys(sections).length > 1 ? (
        <EditorSections {...sections} />
      ) : (
        sections.controls
      )}
    </Stack>
  );
};

export default ParamsEditor;
