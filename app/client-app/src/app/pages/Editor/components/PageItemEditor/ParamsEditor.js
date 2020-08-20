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

// TODO: move to data-structures service
const getNestedChild = (source, path) => {
  if (source == null) return null;
  if (!Array.isArray(source) || typeof source !== "object")
    // TODO: functions should work too
    throw new Error(
      `Can only access children of arrays or objects. Provided source was ${typeof source}`
    );

  // parse the path
  const segments = path.split(".");

  // drill down to the child
  let result = source;
  for (const key in segments) {
    const intKey = parseInt(key);
    result = result[!isNaN(intKey) ? intKey : key];
  }

  return result;
};

const convertShorthands = (paramType) => {
  paramType = convertStringShorthands(paramType);
  paramType = convertArrayShorthands(paramType);
  if (!paramType.type) {
    paramType = { type: "group", paramTypes: paramType };
  }
  return paramType;
};

const buildControls = (_context, paramTypes, root = false) =>
  Object.keys(paramTypes).reduce(
    (result, key) => {
      let pt = paramTypes[key];

      if (!pt) return result;
      pt = convertShorthands(pt);
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

      // ensure pt has a path before further action
      pt.path = pt.path || key;

      let controls;
      if (pt.type === "group") {
        // TODO: reference types enum

        // nested paths where not specified
        if (!pt.flatPaths) {
          pt.paramTypes = Object.keys(pt.paramTypes).reduce(
            (paramTypes, innerKey) => {
              let paramType = pt.paramTypes[innerKey];
              // need to convert shorthands upfront
              // so we can add path properties
              paramType = convertShorthands(paramType);
              return {
                ...paramTypes,
                [innerKey]: {
                  ...paramType,
                  path: paramType.path || `${pt.path}.${innerKey}`,
                },
              };
            },
            {}
          );
        }

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
            value={getNestedChild(_context.params, pt.path) ?? pt.defaultValue}
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
