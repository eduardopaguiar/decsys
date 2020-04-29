import React from "react";
import PropTypes from "prop-types";
import { FaQuestion } from "react-icons/fa";
import { Flex, Heading, Button } from "@chakra-ui/core";
import { navigate } from "@reach/router";

const EmptyState = ({ splash, message, callToAction }) => (
  <Flex direction="column" w="100%" align="center" justify="center">
    <Flex
      w="20%"
      color="cyan.500"
      borderColor="cyan.500"
      borderWidth={2}
      borderRadius={15}
      p={10}
    >
      <Flex as={splash} size="100%" />
    </Flex>
    <Heading as="h1" size="xl" m={8}>
      {message}
    </Heading>
    {callToAction && (
      <Button size="lg" onClick={() => callToAction.onClick(navigate)}>
        {callToAction.label}
      </Button>
    )}
  </Flex>
);

EmptyState.propTypes = {
  splash: PropTypes.node,
  message: PropTypes.string,
  callToAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  })
};

EmptyState.defaultProps = {
  splash: FaQuestion,
  message: "Looks like there's nothing here!"
};

export default EmptyState;
