import React from "react";
import { Box } from "@chakra-ui/react";
import { Intro } from "./sections/intro";
import { About } from "./sections/about";
import { Numbers } from "./sections/numbers";
export const Landing = () => {
  return (
    <Box>
      <Intro />
      <About />
      <Numbers />
    </Box>
  );
};
