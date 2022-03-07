import React, { useCallback, useEffect, useRef, useState } from "react";
import Crossword, {
  CrosswordImperative,
  CrosswordGrid,
  CrosswordProvider,
  CrosswordProviderImperative,
  DirectionClues,
  AnswerTuple,
} from "@jaredreisinger/react-crossword";
import {
  Box,
  Flex,
  Heading,
  HStack,
  VStack,
  Button,
  Center,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { crosswordList } from "../constants/dummyData/crosswordList";
import { ClueTypeOriginal } from "@jaredreisinger/react-crossword/dist/types";
import { Error } from "../components/error";
import { Loading } from "../components/loading";

type CrosswordParams = {
  id: string;
};
type CluesInputWithTitle = {
  title: string;
  across: Record<string, ClueTypeOriginal>;
  down: Record<string, ClueTypeOriginal>;
};

function CrosswordPuzzle() {
  let { id } = useParams<CrosswordParams>();
  const [loading, setLoading] = useState(true);
  const [sessionStart, setSessionStart] = useState(true);
  const [crosswordData, setCrosswordData] = useState<CluesInputWithTitle>();
  const [isCorrect, setIsCorrectValue] = useState(false);

  const onCrosswordCorrectProvider = useCallback((isCorrect: boolean) => {
    // console.log(isCorrect);
    const endTime = Date.now();
    //TODO Add session end time ^ to database with the User Address
    console.log(endTime);
    setIsCorrectValue(isCorrect);
  }, []);
  const handleBeginSession = async () => {
    const startTime = Date.now();
    //TODO Add session start time ^ to database with the User Address
    console.log(startTime);
    setSessionStart(true);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        //TODO make a call to the database instead of grabbing from test data
        setCrosswordData(crosswordList[Number(id)]);
        setLoading(false);
      } catch (e) {
        return <Error />;
      }
    }
    if (sessionStart) {
      fetchData();
    }
  }, [id, sessionStart]);

  if (!sessionStart) {
    return (
      <Flex justifyContent="center" alignItems="center" height="800px">
        <Button onClick={handleBeginSession}>Begin Session</Button>
      </Flex>
    );
  } else if (loading) {
    return <Loading />;
  } else {
    if (crosswordData) {
      return (
        <>
          {isCorrect ? (
            <Flex justifyContent="center" alignItems="center" pt={"10px"}>
              <Button w="50%" colorScheme="green">
                Submit!
              </Button>
            </Flex>
          ) : (
            ""
          )}
          <Flex justifyContent="center" alignItems="center" pt={"20px"}>
            <HStack>
              <Box boxSize={"sm"}>
                <Flex justifyContent="center" alignItems="center" pt={"20px"}>
                  <Heading
                    fontSize={{
                      base: 10, // 0-48em
                      md: 20, // 48em-80em,
                      xl: 30, // 80em+
                    }}
                    letterSpacing="6px"
                  >
                    {crosswordData.title}
                  </Heading>
                </Flex>
                <Crossword
                  onCrosswordCorrect={onCrosswordCorrectProvider}
                  data={crosswordData!}
                />
              </Box>
              <Box boxSize={"sm"} pt={"80px"}>
                <VStack>
                  <Button> Check word</Button>
                  <Button> Check Puzzle</Button>
                  <Heading
                    fontSize={{
                      base: 10, // 0-48em
                      md: 20, // 48em-80em,
                      xl: 30, // 80em+
                    }}
                    letterSpacing="2px"
                    pt={"20px"}
                    pb={"20px"}
                  >
                    Get Help
                  </Heading>
                  <Button> Get a Hint</Button>
                  <Button> Reveal Square</Button>
                  <Button> Reveal Word</Button>
                </VStack>
              </Box>
            </HStack>
          </Flex>
        </>
      );
    } else {
      return <div>error</div>;
    }
  }
}

export default CrosswordPuzzle;
