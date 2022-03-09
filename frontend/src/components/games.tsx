import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Link,
  Heading,
  Image,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link as ReactRouter } from "react-router-dom";
import axios from "axios";
import Crossword from "../constants/images/Crossword.png";
import LearnFrench from "../constants/images/LearnFrench.png";
import Wordle from "../constants/images/Wordle.png";
import WordSearch from "../constants/images/WordSearch.png";
import { Error } from "../components/error";
import { Loading } from "./loading";
import { Header } from "./header";
const imageObject = {
  1: Crossword,
  2: Wordle,
  3: WordSearch,
  4: LearnFrench,
};

export const Games = () => {
  const [gameTypeList, setGameTypeList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        await axios.get("http://localhost:3001/gameTypes/").then((result) => {
          setGameTypeList(result.data);
        });
        setLoading(false);
      } catch (e) {
        return <Error />;
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <Box>
        <Box bg={"#09245e"}>
          <Header />
        </Box>

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
              Choose a game!
            </Heading>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            <Grid templateColumns="repeat(2, 1fr)" gap={12}>
              {gameTypeList?.map((game) => (
                <GridItem key={game["gameTypeName"]}>
                  <Link
                    as={ReactRouter}
                    to={`/${game["gameTypeName"]}selection`}
                  >
                    <Image
                      boxSize="150px"
                      src={imageObject[game["gameTypeID"]]}
                    />
                  </Link>
                </GridItem>
              ))}
            </Grid>
          </Flex>
        </Box>
      </Box>
    );
  }
};
