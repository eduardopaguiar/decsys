import React, { useState, useEffect, createElement } from "react";
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
} from "@chakra-ui/core";

const useDelayedChangeHandler = (paramKey, init, onChange) => {
  const [timer, setTimer] = useState();

  const [value, setValue] = useState(init); // we use local state so updates work without delay
  useEffect(() => setValue(init), [init]); // but still ensure update when new props come in

  const delayedHandleValueChange = (e) => {
    //at time of writing,
    //Number Inputs send string values;
    //everything else sends SyntheticEvents
    let inputValue;
    switch (typeof e) {
      case "string":
        inputValue = e;
        break;
      case "object":
        inputValue = e.target.value;
        e.persist();
        break;
      default:
        throw new TypeError("expected a SyntheticEvent or a string");
    }

    setValue(inputValue); // update our local state

    //delay, then fire the onChange passed in to update remote state
    clearTimeout(timer); // reset the delay timer every change
    setTimer(setTimeout(() => onChange(paramKey, inputValue), 500));
  };

  return [value, delayedHandleValueChange];
};

const StringControl = ({ paramKey, value, onChange }) => {
  const [text, delayedHandleChange] = useDelayedChangeHandler(
    paramKey,
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
    onChange(paramKey, e.target.checked);
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
    onChange(paramKey, v);
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

const NumberControl = ({ paramKey, value, paramType, onChange }) => {
  const [text, delayedHandleChange] = useDelayedChangeHandler(
    paramKey,
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

const ParamControl = (p) => {
  const {
    paramType: { type },
  } = p;

  const controlMap = {
    [types.string]: StringControl,
    [types.number]: NumberControl,
    [types.bool]: BoolControl,
    [types.oneOf]: OneOfControl,
  };

  if (!Object.keys(controlMap).includes(type))
    throw new Error("Unknown Parameter type");

  return createElement(controlMap[type], p);
};

export default ParamControl;
