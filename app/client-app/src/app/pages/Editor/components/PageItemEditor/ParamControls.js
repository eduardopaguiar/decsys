import React, { useState, useEffect, createElement, useMemo } from "react";
import { types } from "@decsys/param-types";
import {
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  RadioGroup,
  Stack,
  Radio,
  FormControl,
  FormLabel,
  Grid,
  Button,
  Flex,
  IconButton,
} from "@chakra-ui/core";
import { FaPlusCircle, FaTimes } from "react-icons/fa";
import { convertShorthands } from "services/param-types";
import { useDelayedChangeHandler, buildControls } from "./helpers";
import { setNestedChild } from "services/data-structures";

const StringControl = ({ paramType, value, onChange }) => {
  const [text, delayedHandleChange] = useDelayedChangeHandler(
    paramType.path,
    value,
    onChange
  );

  return (
    <Input
      borderColor="gray.400"
      size="sm"
      type="text"
      onChange={delayedHandleChange}
      value={text}
    />
  );
};

const BoolControl = ({ paramKey, value, paramType, onChange }) => {
  const handleCheckedChange = (e) => {
    e.persist();
    onChange(paramType.path, e.target.checked);
  };

  return (
    <Checkbox
      isChecked={value}
      onChange={handleCheckedChange}
      p=".1em"
      borderColor="gray.400"
    >
      {paramType.label || paramKey}
    </Checkbox>
  );
};

const OneOfControl = ({ paramKey, value, paramType, onChange }) => {
  const [localValue, setLocalValue] = useState(value); // we use local state so updates work without delay
  useEffect(() => setLocalValue(value), [value]); // but still ensure update when new props come in

  const handleValueChange = (v) => {
    onChange(paramType.path, v);
    setLocalValue(v);
  };

  return (
    <RadioGroup onChange={handleValueChange} value={localValue}>
      <Stack direction="row">
        {paramType.oneOf.map((x) => (
          <Radio
            key={`${paramKey}_radio_${x}`}
            borderColor="gray.400"
            name={`${paramKey}_radio`}
            value={x}
          >
            {x}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
};

const NumberControl = ({ value, paramType, onChange }) => {
  const [text, delayedHandleChange] = useDelayedChangeHandler(
    paramType.path,
    value,
    onChange
  );

  return (
    <NumberInput
      size="sm"
      step={1}
      defaultValue={text}
      onChange={delayedHandleChange}
    >
      <NumberInputField borderColor="gray.400" />
      <NumberInputStepper borderColor="gray.400">
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
};

const ArrayControl = ({ paramKey, value, paramType, onChange }) => {
  const childType = useMemo(() => convertShorthands(paramType.childType), [
    paramType.childType,
  ]);

  const [items, setItems] = useState(value ?? []);
  // TODO: update items on incoming value prop?

  const [itemControls, setItemControls] = useState([]);
  useEffect(() => {
    console.log(items);
    setItemControls(
      buildControls(
        {
          params: items,
          handleParamChange: (paramPath, value) => {
            setItems((items) => {
              setNestedChild(items, paramPath, value);
              return [...items];
            });
            onChange(`${paramType.path}.${paramPath}`, value);
          },
        },
        Array(items.length)
          .fill(1)
          .map((_, i) => ({
            ...childType,
            // add ordering to child labels
            // also count from 1 in the UI ;)
            label: !!childType.label ? `${childType.label} ${i + 1}` : i + 1,
          }))
      ).controls
    );
  }, [items, onChange, paramType, childType]);

  const handleAddItem = () => {
    // TODO: API
    setItems((items) => [
      ...items,
      childType.type === "group" ? {} : childType.defaultValue,
    ]);
  };

  const handleDeleteItem = (i) => {
    // TODO: API
    setItems((items) => {
      items.splice(i, 1);
      return [...items];
    });
  };

  return (
    <>
      <Flex>
        <Button
          size="sm"
          colorScheme="green"
          variant="outline"
          onClick={handleAddItem}
          leftIcon={<FaPlusCircle />}
          lineHeight={0}
        >
          Add item
        </Button>
      </Flex>
      {items.map((_, i) => (
        <>
          <Flex h="100%" justify="flex-end" align="start">
            <IconButton
              variant="ghost"
              size="xs"
              colorScheme="red"
              icon={<FaTimes />}
              onClick={() => handleDeleteItem(i)}
            />
          </Flex>
          {itemControls[i]}
        </>
      ))}
    </>
  );
};

const ParamControl = (p) => {
  const {
    paramType: { type },
  } = p;

  const controlMap = {
    [types.string]: StringControl,
    [types.number]: NumberControl,
    [types.bool]: BoolControl,
    [types.oneOf]: OneOfControl,
    array: ArrayControl, // TODO: use types enum
  };

  if (!Object.keys(controlMap).includes(type))
    throw new Error("Unknown Parameter type");

  return createElement(controlMap[type], p);
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

export const ParamControlRow = ({
  value,
  paramType,
  paramKey,
  handleParamChange,
}) => {
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
