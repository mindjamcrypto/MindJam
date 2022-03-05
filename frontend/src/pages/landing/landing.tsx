import React from "react";
import { Box } from "@chakra-ui/react";
import { Intro } from "./sections/intro";
import { About } from "./sections/about";
export const Landing = () => {
  return (
    <Box>
      <Intro />
      <About />
    </Box>
  );
};
