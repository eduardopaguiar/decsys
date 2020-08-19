import React from "react";
import { ChakraProvider, CSSReset } from "@chakra-ui/core";
import themes from "themes";

export const decorators = [
  (s) => (
    <>
      <ChakraProvider theme={themes}>
        <CSSReset />
        {s()}
      </ChakraProvider>
    </>
  ),
];
