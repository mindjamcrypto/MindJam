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
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { crosswordList } from "../constants/dummyData/crosswordList";
import { ClueTypeOriginal } from "@jaredreisinger/react-crossword/dist/types";
import { Error } from "../components/error";
import { Loading } from "../components/loading";
import { getSquareHint } from "../actions/CrosswordsActions";
import { mintNFT } from "../utils/nftMinter";
import { Header } from "./header";
import { ethers } from "ethers";
import crosswordsContract from "../contracts/Crosswords.json";
import contractAdresses from "../contracts/contract-address.json";
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
const provider = new ethers.providers.Web3Provider(window.ethereum);

function CrosswordPuzzle() {
  let { id } = useParams<CrosswordParams>();
  const crossword = useRef<CrosswordImperative>(null);
  const [loading, setLoading] = useState(true);
  const [squareWaiting, setSquareWaiting] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Loading...");
  const [sessionStart, setSessionStart] = useState(false);
  const [crosswordData, setCrosswordData] = useState<mongoFormat>();
  const [isCorrect, setIsCorrectValue] = useState(false);
  const [correctWordArray, setCorrectWordArray] = useState<Array<string>>([]);
  const [checkWordId, setCheckWordId] = useState("");
  const [status, setStatus] = useState("");
  const [ethersCrosswordContract, setEthersCrosswordContract] =
    useState<ethers.Contract>();
  const [userSigner, setUserSigner] = useState<ethers.Signer>();
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
    //make call to smart contract

    const paid = await getSquareHint(
      account,
      0,
      crosswordData?.PaidActionObject.square
    ); //hardcoded until we figure out ids
    setSquareWaiting(true);
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
    setLoading(true);
    setLoadingMsg("Congratulations! You won a free MindJam NFT!");
    await handleNFTMinting('completor');
    console.log("Submit to smart contract here");
    setLoading(false);
  };

  const handleCheckWord = async () => {
    if (correctWordArray.includes(checkWordId)) {
      alert("Correct!");
    } else {
      alert("Try Again!");
    }
  };
  const handleNFTMinting = async (nftType:String) => { //TODO: implement
    const {status} = await mintNFT(nftType);
    setStatus(status);
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
    //setIsCorrectValue(true); //testing==================
  }, [id]);

  useEffect(() => {
    // listen for event
    if (account) {
      ethersCrosswordContract!.on("RequestSquare", onRequestSquare);
      console.log("Turning on RequestSquare , & open listener");
    }
    return () => {
      if (account) {
        ethersCrosswordContract!.off("RequestSquare", onRequestSquare);
        console.log("Turning off Lotto ticket minted, & close listener");
      }
    };
  }, [account]);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const crosswordsC = new ethers.Contract(
        contractAdresses.Crosswords,
        crosswordsContract.abi,
        signer
      );

      setEthersCrosswordContract(crosswordsC);
    }
  }, []);

  const onRequestSquare = async (account: String, cid: number) => {
    console.log("REVEAL SQUARE EMITTED:", account, "cid:", cid);
    setSquareWaiting(false);
    fillOneCell();
  };

  if (!account.length) {
    return (
      <Box>
        <Box bg={"#09245e"}>
          <Header />
        </Box>
        <Flex justifyContent="center" alignItems="center" height="800px">
          <Button onClick={handleSubmit}>Connect Wallet</Button>
        </Flex>
      </Box>
    );
  } else if (account && !sessionStart && crosswordData) {
    return (
      <Box>
        <Box bg={"#09245e"}>
          <Header />
        </Box>
        <Flex justifyContent="center" alignItems="center" height="800px">
          <VStack>
            <Button fontSize={15} letterSpacing="1.5px">
              Connected: {account.substring(2, 6)} ...
              {account.substring(37, 41)}
            </Button>
            <Button onClick={handleBeginSession}>Begin Session</Button>{" "}
          </VStack>
        </Flex>
      </Box>
    );
  } else if (loading) {
    return <Loading msg={loadingMsg} />;
  } else {
    if (crosswordData) {
      return (
        <Box>
          <Box bg={"#09245e"}>
            <Header />
          </Box>
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
                  <Button onClick={handleRevealLetter}>
                    Reveal Square -{">"} Cost: 10 MJ
                  </Button>
                  {squareWaiting ? (
                    <Flex alignItems={"center"}>
                      <Text marginRight="2">Revealing </Text>
                      <Spinner />
                    </Flex>
                  ) : (
                    ""
                  )}
                  <Button onClick={fillMultipleCells}>
                    {" "}
                    Reveal Word -{">"} Cost: 15 MJ
                  </Button>
                  <Button onClick={reset}>Reset</Button>
                </VStack>
              </Box>
            </HStack>
          </Flex>
          {isCorrect ? (
            <>
            <Flex
              justifyContent="center"
              alignItems="center"
              pt={"10px"}
              height="700px"
            >
              <Button w="50%" colorScheme="green" onClick={handleSubmitToSM} >
                Submit!
              </Button>
              <Text fontSize='md' id="status">        {status}      </Text>
            </Flex>

            </>
          ) : (
            ""
          )}
        </Box>
      );
    } else {
      return <Error />;
    }
  }
}

export default CrosswordPuzzle;
