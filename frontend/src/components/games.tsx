// @ts-nocheck
import React from "react";
import {
  Box,
  HStack,
  Button,
  VStack,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import Crossword from "@jaredreisinger/react-crossword";
import { crosswordList } from "../constants/dummyData/crosswordList";

export const Games = () => {
  return (
    <Box
      w="full"
      bg="whiteAlpha.900"
      px={{
        base: "50px", // 0-48em
        md: "100px", // 48em-80em,
        xl: "200px", // 80em+
      }}
      py="60px"
    >
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {crosswordData.map((puzzle) => (
          <GridItem>
            <Crossword data={puzzle} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};
