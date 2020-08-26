import React from "react";
import { ChakraProvider, CSSReset } from "@chakra-ui/core";
import theme from "@chakra-ui/theme";

export const decorators = [
  (s) => (
    <>
      <ChakraProvider theme={theme}>
        <CSSReset />
        {s()}
      </ChakraProvider>
    </>
  ),
];
