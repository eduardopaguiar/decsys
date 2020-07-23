import React from "react";
import { Container } from "@chakra-ui/core";

const DefaultContainer = ({ children }) => {
  return (
    // TODO: make responsive
    <Container
      px={{ base: 2, xl: 0 }}
      maxWidth={{ base: "100%", xl: "1140px" }}
      mx="auto"
    >
      {children}
    </Container>
  );
};

export default DefaultContainer;