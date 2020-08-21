import React, {
  useState,
  useEffect,
  createElement,
  useMemo,
  Fragment,
} from "react";
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
  Tooltip,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from "@chakra-ui/core";
import { FaPlusCircle, FaTimes, FaRegQuestionCircle } from "react-icons/fa";
import { CgColorPicker } from "react-icons/cg";
import { convertShorthands } from "services/param-types";
import { buildControls } from "./helpers";
import { setNestedChild } from "services/data-structures";
import { useDerivedState } from "hooks/useDerivedState";
import { SketchPicker } from "react-color";
import { useDeferredAction } from "hooks/useDeferredAction";

const StringControl = ({ paramType, value = "", onChange }) => {
  const [text, setText] = useDerivedState(value);
  const deferHandleChange = useDeferredAction(onChange, 500);

  const handleChange = (e) => {
    e.persist(); // TODO: React 17
    setText(e.target.value);
    deferHandleChange(paramType.path, e.target.value);
  };

  return (
    <Stack direction="row">
      <Input
        borderColor="gray.400"
        size="sm"
        type="text"
        onChange={handleChange}
        value={text}
        maxLength={paramType.limit}
      />
      {paramType.limit && (
        <Flex minW="150px" color="gray.500" align="center">
          ({text.length} of {paramType.limit})
        </Flex>
      )}
    </Stack>
  );
};

const BoolControl = ({ paramKey, value = false, paramType, onChange }) => {
  const [localValue, setLocalValue] = useDerivedState(value);

  const handleCheckedChange = (e) => {
    e.persist(); // TODO: remove in React 17
    setLocalValue(e.target.checked);
    onChange(paramType.path, e.target.checked);
  };

  return (
    <Checkbox
      isChecked={localValue}
      onChange={handleCheckedChange}
      p=".1em"
      borderColor="gray.400"
    >
      {paramType.label || paramKey}
    </Checkbox>
  );
};

const OneOfControl = ({ paramKey, value, paramType, onChange }) => {
  const [localValue, setLocalValue] = useDerivedState(
    ({ value, fallback }) => value ?? fallback,
    { value, fallback: paramType.oneOf[0] }
  );

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

const NumberControl = ({ value = 0, paramType, onChange }) => {
  const lower = paramType.min != null;
  const upper = paramType.max != null;
  const range = lower && upper;

  const [number, setNumber] = useDerivedState(value);
  const deferHandleChange = useDeferredAction((path, value) => {
    // clamp
    if (lower && value < paramType.min) value = paramType.min;
    if (upper && value > paramType.max) value = paramType.max;
    setNumber(value);

    onChange(path, value);
  }, 500);

  const handleChange = (number) => {
    setNumber(number);
    deferHandleChange(paramType.path, number);
  };

  return (
    <Stack direction="row">
      <NumberInput
        size="sm"
        step={1}
        value={number}
        onChange={handleChange}
        // blurring when deleting a focused field is problematic.
        // so instead we manually clamp in our change handler, above.
        clampValueOnBlur={false}
        min={paramType.min}
        max={paramType.max}
        maxW="150px"
      >
        <NumberInputField borderColor="gray.400" />
        <NumberInputStepper borderColor="gray.400">
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {(upper || lower) && (
        <Flex color="gray.500" align="center">
          (
          {range
            ? `between ${paramType.min} and ${paramType.max}`
            : (upper && `up to ${paramType.max}`) ||
              (lower && `${paramType.min} or higher`)}
          )
        </Flex>
      )}
    </Stack>
  );
};

const ArrayControl = ({ value = [], paramType, onChange }) => {
  const childType = useMemo(() => convertShorthands(paramType.childType), [
    paramType.childType,
  ]);

  const [items, setItems] = useDerivedState(value);
  const [itemControls, setItemControls] = useState([]);

  useEffect(() => {
    // Rebuild our (and our children's) controls tree
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
  }, [items, onChange, paramType, childType, setItems]);

  const handleAddItem = () => {
    if (paramType.limit && paramType.limit <= items.length) {
      console.error(`Array items limit reached: ${paramType.limit}`);
      return;
    }

    const defaultValue = (() => {
      switch (childType.type) {
        case "group":
          return {};
        case "array":
          return [];
        default:
          return childType.defaultValue;
      }
    })();

    // set our own local state
    const newItems = [...items, defaultValue];
    setItems(newItems);

    onChange(paramType.path, newItems);

    // TODO: API
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
      <Stack direction="row">
        <Button
          size="sm"
          colorScheme="green"
          variant="outline"
          onClick={handleAddItem}
          leftIcon={<FaPlusCircle />}
          lineHeight={0}
          disabled={paramType.limit <= items.length}
        >
          Add item
        </Button>
        {paramType.limit && (
          <Flex align="center" color="gray.500">
            ({items.length} of {paramType.limit})
          </Flex>
        )}
      </Stack>
      {items.map((_, i) => (
        <Fragment key={i}>
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
        </Fragment>
      ))}
    </>
  );
};

const ColorControl = ({ paramType, value = "", onChange }) => {
  const [color, setColor] = useDerivedState(value);

  const deferredHandleChange = useDeferredAction(onChange, 500);

  const handlePickerChange = (color) => {
    setColor(color.hex);
  };

  const handleColorChange = (color) => {
    setColor(color.hex);
    deferredHandleChange(paramType.path, color.hex);
  };

  const handleTextChange = (e) => {
    e.persist(); // TODO: React 17 change
    handleColorChange({ hex: e.target.value });
  };

  return (
    <Stack direction="row">
      <Flex w="30px" css={{ background: color }}></Flex>
      <Input
        w="100px"
        borderColor="gray.400"
        size="sm"
        type="text"
        onChange={handleTextChange}
        value={color}
      />
      <Popover>
        <PopoverTrigger>
          <IconButton size="sm" icon={<CgColorPicker />} />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <SketchPicker
              color={color}
              onChange={handlePickerChange}
              onChangeComplete={handleColorChange}
              disableAlpha
              presetColors={[]}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Stack>
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
    color: ColorControl,
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
      <Flex justify="flex-end">
        <FormLabel
          textAlign="right"
          fontWeight="medium"
          color={isLabelledType ? "inherit" : "gray.400"}
          m={0}
        >
          {isLabelledType ? paramType.label || paramKey : " ~ "}
        </FormLabel>
        {paramType.info && (
          <Tooltip
            shouldWrapChildren
            hasArrow
            openDelay={200}
            label={paramType.info}
          >
            <sup>
              <Icon color="gray.500" m={1} as={FaRegQuestionCircle} />
            </sup>
          </Tooltip>
        )}
      </Flex>

      <ParamControl
        value={value}
        paramType={paramType}
        paramKey={paramKey}
        onChange={handleParamChange}
      />
    </ControlsGrid>
  );
};
