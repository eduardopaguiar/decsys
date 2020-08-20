import React from "react";
import ParamControl from "./ParamControl";
import {
  Grid,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Stack,
} from "@chakra-ui/core";

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
const convertStringShorthands = (type) =>
  typeof type !== "string" ? type : convertArrayShorthands([type]);

const buildControls = (_context, paramTypes, root = false) =>
  Object.keys(paramTypes).reduce(
    (result, key) => {
      let pt = paramTypes[key];

      if (!pt) return result;

      // we do some non destructive shorthand conversion attempts
      pt = convertStringShorthands(pt);
      pt = convertArrayShorthands(pt);

      // if we're here, pt is a full ParamTypes object, or invalid ¯\_(ツ)_/¯

      if (pt.type === "section") {
        // TODO: reference types enum
        if (!root) {
          console.error(
            `DECSYS does not allow nested Parameter Type Sections at this time. Section: ${key}`
          );
          return result;
        }

        return {
          ...result,
          [key]: buildControls(_context, pt.paramTypes),
        };
      }

      let controls;
      if (pt.type === "group" || !pt.type) {
        // TODO: reference types enum
        if (!pt.type) pt = { paramTypes: pt };
        controls = (
          <Stack p={2} pt={0} bg="blackAlpha.200" borderRadius={10}>
            <Text p={1} fontWeight="medium" borderBottom="thin solid">
              {pt.label || key}
            </Text>
            {buildControls(_context, pt.paramTypes).controls},
          </Stack>
        );
      } else {
        controls = (
          <ParamControlRow
            key={key}
            paramKey={key}
            paramType={pt}
            value={_context.params?.[key] ?? pt.defaultValue}
            handleParamChange={_context.handleParamChange}
          />
        );
      }

      return {
        ...result,
        controls: [...result.controls, controls],
      };
    },
    { controls: [] }
  );

const ParamControlRow = ({ value, paramType, paramKey, handleParamChange }) => {
  const isLabelledType = paramType.type !== "bool";
  return (
    <ControlsGrid>
      <FormLabel
        id={`${paramKey}-label`}
        textAlign="right"
        fontWeight="medium"
        color={isLabelledType ? "inherit" : "gray.400"}
        mb={0}
      >
        {isLabelledType ? paramType.label || paramKey : " ~ "}
      </FormLabel>

      <ParamControl
        value={value}
        paramType={paramType}
        paramKey={paramKey}
        onChange={handleParamChange}
      />
    </ControlsGrid>
  );
};

const ControlsGrid = (p) => (
  <FormControl
    as={Grid}
    templateColumns="2fr 5fr"
    gap={2}
    alignItems="center"
    width="100%"
    {...p}
  />
);

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
          <Tab>{key}</Tab>
        ))}
        {!!controls.length && <Tab>Other</Tab>}
      </TabList>

      <TabPanels>
        {sectionKeys.map((key) => (
          <TabPanel>{sections[key].controls}</TabPanel>
        ))}
        {controls.length && <TabPanel>{controls}</TabPanel>}
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
