import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Link,
  Heading,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link as ReactRouter } from "react-router-dom";
import axios from "axios";
import { Error } from "../components/error";
import { ClueTypeOriginal } from "@jaredreisinger/react-crossword/dist/types";
type mongoFormat = {
  _id: string;
  hints: Array<Object>;
  across: Record<string, ClueTypeOriginal>;
  down: Record<string, ClueTypeOriginal>;
  title: string;
};

export const Games = () => {
  const [crosswordData, setCrosswordData] = useState<Array<mongoFormat>>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        await axios.get("http://localhost:3001/crosswords").then((result) => {
          //console.log(result.data);
          setCrosswordData(result.data);
        });
      } catch (e) {
        return <Error />;
      }
    }
    fetchData();
  }, []);
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
          {crosswordData?.map((puzzle) => (
            <GridItem>
              <Button>
                <Link as={ReactRouter} to={`/crossword/${puzzle._id}`}>
                  {puzzle.title}
                </Link>
              </Button>
            </GridItem>
          ))}
        </Grid>
      </Flex>
    </Box>
  );
};
