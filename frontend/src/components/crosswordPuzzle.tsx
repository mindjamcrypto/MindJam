import React, { useCallback, useEffect, useRef, useState } from "react";
import Crossword, {
  CrosswordImperative,
} from "@jaredreisinger/react-crossword";
import {
  Box,
  Flex,
  Heading,
  HStack,
  VStack,
  Button,
  FormControl,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputStepper,
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
  const crossword = useRef<CrosswordImperative>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStart, setSessionStart] = useState(false);
  const [crosswordData, setCrosswordData] = useState<CluesInputWithTitle>();
  const [isCorrect, setIsCorrectValue] = useState(false);
  const [correctWordArray, setCorrectWordArray] = useState<Array<string>>([]);
  const [checkWordId, setCheckWordId] = useState("");

  const onCrosswordCorrect = useCallback((isCorrect: boolean) => {
    // console.log(isCorrect);
    const endTime = Date.now();
    console.log(endTime);
    //TODO Add session end time ^ to database with the User Address
    setIsCorrectValue(isCorrect);
  }, []);

  const onCorrect = useCallback(
    (direction, number, answer) => {
      setCorrectWordArray([...correctWordArray, number]);
      console.log(`onCorrect: "${direction}", "${number}", "${answer}"`);
    },
    [correctWordArray]
  );
  const onAnswerIncorrect = useCallback(
    (direction, number, answer) => {
      const updatedArr = correctWordArray.filter((id) => {
        return id !== number;
      });
      setCorrectWordArray(updatedArr);
      console.log(`onIncorrect: "${direction}", "${number}", "${answer}"`);
    },
    [correctWordArray]
  );
  const fillOneCell = useCallback((event) => {
    crossword.current?.setGuess(0, 0, "T");
  }, []);
  const fillMultipleCells = useCallback((event) => {
    //All hardcoded, Should come from database
    let revWord = {
      word: "Three",
      direction: "across",
      row: 0,
      col: 0,
    };
    [...revWord.word].forEach((letter, i) => {
      if (revWord.direction === "across") {
        crossword.current?.setGuess(revWord.row, revWord.col + i, letter);
      } else {
        crossword.current?.setGuess(revWord.row + i, revWord.col, letter);
      }
    });
  }, []);
  const reset = useCallback((event) => {
    crossword.current?.reset();
  }, []);

  const onCellChange = useCallback((row: number, col: number, char: string) => {
    //TODO see if we can wipe correct array if cell changes
    console.log(`onCellChange: "${row}", "${col}", "${char}"`);
  }, []);

  const handleBeginSession = async () => {
    const startTime = Date.now();
    //TODO Add session start time ^ to database with the User Address
    console.log(startTime);
    setSessionStart(true);
  };
  const handleCheckWord = async () => {
    if (correctWordArray.includes(checkWordId)) {
      alert("Correct!");
    } else {
      alert("Try Again!");
    }
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
                  ref={crossword}
                  onCrosswordCorrect={onCrosswordCorrect}
                  onCorrect={onCorrect}
                  onCellChange={onCellChange}
                  onAnswerIncorrect={onAnswerIncorrect}
                  data={crosswordData!}
                />
              </Box>
              <Box boxSize={"sm"} pt={"80px"}>
                <VStack>
                  <FormControl w="50%">
                    <NumberInput
                      max={520}
                      min={0}
                      onChange={(valueString) => setCheckWordId(valueString)}
                    >
                      <NumberInputField id="amount" placeholder="1" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <Button onClick={handleCheckWord}>Check Word</Button>
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
                  <Button onClick={fillOneCell}> Reveal Square</Button>
                  <Button onClick={fillMultipleCells}> Reveal Word</Button>
                  <Button onClick={reset}>Reset</Button>
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
