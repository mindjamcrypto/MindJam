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
  Link,
  Heading,
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
      <Flex justifyContent="center" alignItems="center">
        <Heading
          fontSize={{
            base: 20, // 0-48em
            md: 44, // 48em-80em,
            xl: 54, // 80em+
          }}
          letterSpacing="6px"
          pb="15px"
        >
          Choose a crossword puzzle!
        </Heading>
      </Flex>
      <Flex justifyContent="center" alignItems="center">
        <Grid templateColumns="repeat(4, 1fr)" gap={12}>
          {crosswordList.map((puzzle, i) => (
            <GridItem>
              <Button>
                <Link href={`/crossword/${i}`}>{puzzle.title}</Link>
              </Button>
            </GridItem>
          ))}
        </Grid>
      </Flex>
    </Box>
  );
};
