import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Link,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
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
const wordsObject = {
  1: {
    header: "CROSSWORD OF THE DAY",
    desc: "You have 24 hours to complete and submit this CROSSWORD",
  },
  2: {
    header: "WORDLY",
    desc: "You have 24 hours to completethe WORDLY game. The quickest time wins",
  },
  3: {
    header: "WORD PUZZLE",
    desc: "You have 24 hours to complete the WORD PUZZLE game. The quickest time wins",
  },
  4: {
    header: "LEARN FRENCH",
    desc: "You have 24 hours to complete the learn  game. The quickest time wins",
  },
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
            <VStack>
              <Heading
                fontSize={{
                  base: 20, // 0-48em
                  md: 44, // 48em-80em,
                  xl: 54, // 80em+
                }}
                pb="15px"
              >
                START YOUR GAME NOW!
              </Heading>
              <Text textAlign={"center"}>
                WIN MINDJAM TOKENS
                <br />
                CONNECT YOUR METAMASK WALLET
                <br />
                REVEAL CLUES TO SPEED UP YOUR GAME
              </Text>
            </VStack>
          </Flex>
          <Flex justifyContent="center" alignItems="center" pt={"40px"}>
            <Grid templateColumns="repeat(4, 1fr)" gap={12}>
              {gameTypeList?.map((game) => (
                <GridItem key={game["gameTypeName"]}>
                  <Link
                    as={ReactRouter}
                    to={`/${game["gameTypeName"]}selection`}
                  >
                    <Image
                      boxSize="200px"
                      src={imageObject[game["gameTypeID"]]}
                    />
                  </Link>
                  <Flex justifyContent="center" alignItems="center">
                    <ChevronDownIcon boxSize={"80px"} />
                  </Flex>
                  <Box bg={"#0189ca"} boxSize={"200px"}>
                    <Text
                      textColor="whiteAlpha.900"
                      textAlign={"center"}
                      pt="40px"
                      fontWeight={"900"}
                    >
                      {wordsObject[game["gameTypeID"]]["header"]}
                    </Text>
                    <Text textColor={"whiteAlpha.800"} textAlign={"center"}>
                      {wordsObject[game["gameTypeID"]]["desc"]}
                    </Text>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </Flex>
        </Box>
      </Box>
    );
  }
};
