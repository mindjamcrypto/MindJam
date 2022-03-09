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
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { crosswordList } from "../constants/dummyData/crosswordList";
import { ClueTypeOriginal } from "@jaredreisinger/react-crossword/dist/types";
import { Error } from "../components/error";
import { Loading } from "../components/loading";
import { getSquareHint } from "../actions/CrosswordsActions";

declare var window: any;
type CrosswordParams = {
  id: string;
};
interface RevealSquares {
  row: number;
  col: number;
  letter: string;
}
interface revealWord {
  row: number;
  col: number;
  direction: string;
  word: string;
}
type mongoFormat = {
  _id: string;
  GameTypeId: number;
  GameTitle: string;
  PaidActionObject: Record<string, number>;
  FastedCompletionTime: number;
  isActive: boolean;
  GameData: GameData;
};

type GameData = {
  _id: string;
  revealSquares: Array<RevealSquares>;
  across: Record<string, ClueTypeOriginal>;
  down: Record<string, ClueTypeOriginal>;
  title: string;
  revealWords: Array<revealWord>;
};

function CrosswordPuzzle() {
  let { id } = useParams<CrosswordParams>();
  const crossword = useRef<CrosswordImperative>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStart, setSessionStart] = useState(false);
  const [crosswordData, setCrosswordData] = useState<mongoFormat>();
  const [isCorrect, setIsCorrectValue] = useState(false);
  const [correctWordArray, setCorrectWordArray] = useState<Array<string>>([]);
  const [checkWordId, setCheckWordId] = useState("");

  //METAMASK CONNECT LOGIC
  const [account, setAccountState] = useState("");
  const connectUsersMeta = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  };
  let handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let account0 = await connectUsersMeta();
    setAccountState(account0);
  };

  window.ethereum.on("accountsChanged", function (accounts: Array<string>) {
    setAccountState(accounts[0]);
  });

  //CROSSWORD LOGIC
  const onCrosswordCorrect = useCallback(
    async (isCorrect: boolean) => {
      // console.log(isCorrect);
      const endTime = Date.now();
      if (crosswordData) {
        console.log("UPDATING SESSION WITH END TIME");
        await axios.post("http://localhost:3001/session/end", {
          params: {
            endTime: endTime,
            gameID: crosswordData._id,
            account: account,
          },
        });
        setIsCorrectValue(isCorrect);
      } else {
        console.log("crosswordDATA IS UNDEFINED??");
      }
    },
    [crosswordData]
  );

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
  const fillOneCell = useCallback(() => {
    const hint = crosswordData?.GameData.revealSquares[0];
    crossword.current?.setGuess(hint!.row, hint!.col, hint!.letter);
  }, [crosswordData]);

  const fillMultipleCells = useCallback(
    (event) => {
      let revWord = crosswordData?.GameData.revealWords[0]; //TODO should the hints be random? how many hints?
      [...revWord!.word].forEach((letter, i) => {
        if (revWord!.direction === "across") {
          crossword.current?.setGuess(revWord!.row, revWord!.col + i, letter);
        } else {
          crossword.current?.setGuess(revWord!.row + i, revWord!.col, letter);
        }
      });
    },
    [crosswordData]
  );
  const reset = useCallback(
    (event) => {
      crossword.current?.reset();
    },
    [crosswordData]
  );

  const handleRevealLetter = async () => {
    // //make call to smart contract
    // const paid = await getSquareHint(
    //   account,
    //   0,
    //   crosswordData?.PaidActionObject.square
    // ); //hardcoded until we figure out ids
    // console.log(paid);
    fillOneCell();
  };

  const handleBeginSession = useCallback(async () => {
    const startTime = Date.now();
    // if there is not a session in the database already
    console.log(crosswordData?._id);
    const hasSession = await axios.get("http://localhost:3001/session/check", {
      params: {
        gameID: crosswordData?._id,
        account: account,
      },
    });
    console.log(hasSession);
    if (hasSession.data) {
      //already started session so do not add another doc
      console.log("ALREADY HAS SESSION in DB");
      setSessionStart(true);
    } else {
      console.log("CREATING NEW SESSION");
      await axios.post("http://localhost:3001/session/start", {
        params: {
          startTime: startTime,
          gameID: crosswordData!._id,
          account: account,
        },
      });
      setSessionStart(true);
    }
  }, [crosswordData, account]);

  const handleSubmitToSM = async () => {
    console.log("Submit to smart contract here");
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
        await axios
          .get("http://localhost:3001/crosswords/" + id)
          .then((result) => {
            setCrosswordData(result.data);
          });
        setLoading(false);
      } catch (e) {
        return <Error />;
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  if (!account.length) {
    return (
      <Flex justifyContent="center" alignItems="center" height="800px">
        <Button onClick={handleSubmit}>Connect Wallet</Button>
      </Flex>
    );
  } else if (account && !sessionStart && crosswordData) {
    return (
      <Flex justifyContent="center" alignItems="center" height="800px">
        <VStack>
          <Button fontSize={15} letterSpacing="1.5px">
            Connected: {account.substring(2, 6)} ...
            {account.substring(37, 41)}
          </Button>
          <Button onClick={handleBeginSession}>Begin Session</Button>{" "}
        </VStack>
      </Flex>
    );
  } else if (loading) {
    return <Loading />;
  } else {
    if (crosswordData) {
      return (
        <>
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
                    {crosswordData.GameData.title}
                  </Heading>
                </Flex>
                <Crossword
                  ref={crossword}
                  onCrosswordCorrect={onCrosswordCorrect}
                  onCorrect={onCorrect}
                  onAnswerIncorrect={onAnswerIncorrect}
                  data={crosswordData.GameData}
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
                  <Button onClick={handleRevealLetter}> Reveal Square</Button>
                  <Button onClick={fillMultipleCells}> Reveal Word</Button>
                  <Button onClick={reset}>Reset</Button>
                </VStack>
              </Box>
            </HStack>
          </Flex>
          {isCorrect ? (
            <Flex
              justifyContent="center"
              alignItems="center"
              pt={"10px"}
              height="700px"
            >
              <Button w="50%" colorScheme="green" onClick={handleSubmitToSM}>
                Submit!
              </Button>
            </Flex>
          ) : (
            ""
          )}
        </>
      );
    } else {
      return <div>error</div>;
    }
  }
}

export default CrosswordPuzzle;
