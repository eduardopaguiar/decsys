import React from "react";
import { Text, Stack, Tooltip, Icon } from "@chakra-ui/core";
import { FaRegQuestionCircle } from "react-icons/fa";
import { convertShorthands } from "services/param-types";
import { ParamControlRow } from "./ParamControls";
import { getNestedChild } from "services/data-structures";

// This is massive, maybe we can extract some bits
// but it still needs to be done in a single reduce, ideally
export const buildControls = (_context, paramTypes, root = false) =>
  Object.keys(paramTypes).reduce(
    (result, key) => {
      let pt = paramTypes[key];
      const isArrayChild = !isNaN(parseInt(key));

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

      // we disallow some properties
      // if this is an array childType
      if (isArrayChild) {
        delete pt.path;
        delete pt.flatPaths;
      }

      // ensure pt has a path before further action
      if (!pt.path) pt.path = key;

      let controls;
      if (pt.type === "group") {
        // TODO: reference types enum

        // nested paths
        if (!pt.flatPaths) {
          pt.paramTypes = Object.keys(pt.paramTypes).reduce(
            (paramTypes, innerKey) => {
              let paramType = pt.paramTypes[innerKey];
              // need to convert shorthands upfront
              // so we can add path properties
              paramType = convertShorthands(paramType);

              // calculate the correct nested path
              // if appropriate
              const innerPath = paramType.path || innerKey;
              const nestedPath = `${pt.path}.${innerPath}`;
              const path =
                !paramType.path || isArrayChild ? nestedPath : innerPath;

              return {
                ...paramTypes,
                [innerKey]: {
                  ...paramType,
                  path,
                },
              };
            },
            {}
          );
        }

        controls = (
          // TODO: this should probably be its own component, maybe in ParamControls
          <Stack key={key} p={2} pt={0} bg="blackAlpha.200" borderRadius={10}>
            <Text p={1} fontWeight="medium" borderBottom="thin solid">
              {pt.label || key}
              <Tooltip
                shouldWrapChildren
                hasArrow
                openDelay={200}
                label={pt.info}
              >
                <sup>
                  <Icon color="gray.500" m={1} as={FaRegQuestionCircle} />
                </sup>
              </Tooltip>
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
