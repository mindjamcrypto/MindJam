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
  Image,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
import metamaskHorizontal from "../constants/images/metamask-fox-wordmark-horizontal.svg";
import metamaskStacked from "../constants/images/metamask-fox-wordmark-stacked.svg";
import { ClueTypeOriginal } from "@jaredreisinger/react-crossword/dist/types";
import { Error } from "../components/error";
import { Loading } from "../components/loading";
import { getSquareHint, getWordHint } from "../actions/CrosswordsActions";
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
  const [success, setSuccess] = useState(false);
  const [revWordWaiting, setRevWordWaiting] = useState(false);
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
        await axios.post("https://mindjam-backend.herokuapp.com/session/end", {
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

  const fillMultipleCells = useCallback(() => {
    let revWord = crosswordData?.GameData.revealWords[0]; //TODO should the hints be random? how many hints?
    [...revWord!.word].forEach((letter, i) => {
      if (revWord!.direction === "across") {
        crossword.current?.setGuess(revWord!.row, revWord!.col + i, letter);
      } else {
        crossword.current?.setGuess(revWord!.row + i, revWord!.col, letter);
      }
    });
  }, [crosswordData]);
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

  const handleRevealWord = async () => {
    //make call to smart contract

    const paid = await getWordHint(
      account,
      0,
      crosswordData?.PaidActionObject.word
    ); //hardcoded until we figure out ids
    setRevWordWaiting(true);
  };

  const handleBeginSession = useCallback(async () => {
    const startTime = Date.now();
    // if there is not a session in the database already
    console.log(crosswordData?._id);
    const hasSession = await axios.get(
      "https://mindjam-backend.herokuapp.com/session/check",
      {
        params: {
          gameID: crosswordData?._id,
          account: account,
        },
      }
    );
    console.log(hasSession);
    if (hasSession.data) {
      //already started session so do not add another doc
      console.log("ALREADY HAS SESSION in DB");
      setSessionStart(true);
    } else {
      console.log("CREATING NEW SESSION");
      await axios.post("https://mindjam-backend.herokuapp.com/session/start", {
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
    await handleNFTMinting("completor");
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
  const handleNFTMinting = async (nftType: String) => {
    //TODO: implement
    const { success, status } = await mintNFT(nftType);
    setStatus(status);
    setSuccess(success);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        await axios
          .get("https://mindjam-backend.herokuapp.com/crosswords/" + id)
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
    if (account && ethersCrosswordContract) {
      ethersCrosswordContract.on("RequestSquare", onRequestSquare);
      ethersCrosswordContract.on("RequestWord", onRequestWord);
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
  const onRequestWord = async (account: String, cid: number) => {
    console.log("REVEAL WORD EMITTED:", account, "cid:", cid);
    setRevWordWaiting(false);
    fillMultipleCells();
  };

  if (!account.length) {
    return (
      <Box>
        <Box bg={"#09245e"}>
          <Header />
        </Box>

        <Flex justifyContent="center" alignItems="center" height="800px">
          <VStack>
            <Box bg={"#0189ca"} boxSize={"200px"}>
              <Text
                textColor="whiteAlpha.900"
                textAlign={"center"}
                py="55px"
                fontWeight={"900"}
                px="20px"
              >
                Please connect your MetaMask wallet to continue to the game!
              </Text>
              <Text textColor={"whiteAlpha.800"} textAlign={"center"}></Text>
            </Box>
            <ChevronDownIcon boxSize={"50px"} />
            <Button
              onClick={handleSubmit}
              bg={"blackAlpha.600"}
              boxSize={"175px"}
              maxH={"55px"}
            >
              <Image src={metamaskHorizontal} />
            </Button>
          </VStack>
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
            <Button fontSize={15} size={"lg"} bg={"blackAlpha.600"}>
              <Image src={metamaskStacked} boxSize={"60px"} />
              <Text pt={"6px"}>
                Connected: {account.substring(2, 6)} ...
                {account.substring(37, 41)}
              </Text>
            </Button>
            <Button onClick={handleBeginSession} bg={"#0189ca"}>
              <Text color={"whiteAlpha.900"}>Begin Session</Text>
            </Button>{" "}
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
                    >
                      {crosswordData.GameData.title}
                    </Heading>
                  </Flex>
                  <VStack>
                    <Crossword
                      ref={crossword}
                      onCrosswordCorrect={onCrosswordCorrect}
                      onCorrect={onCorrect}
                      onAnswerIncorrect={onAnswerIncorrect}
                      data={crosswordData.GameData}
                    />
                    {isCorrect ? (
                      success ? (
                        <Flex
                          justifyContent="center"
                          alignItems="center"
                          pt={"10px"}
                        >
                          <Text
                            textColor="whiteAlpha.900"
                            textAlign={"center"}
                            fontWeight={"900"}
                            pt={"10px"}
                            bg={"#0189ca"}
                            width={"60%"}
                          >
                            {status}
                          </Text>
                        </Flex>
                      ) : (
                        <>
                          <Button
                            colorScheme="green"
                            onClick={handleSubmitToSM}
                            w={"100%"}
                          >
                            Submit!
                          </Button>
                          <Text fontSize="md" id="status">
                            {status}
                          </Text>
                        </>
                      )
                    ) : (
                      ""
                    )}
                  </VStack>
                </Box>
                <Box boxSize={"sm"} pt={"80px"}>
                  <VStack>
                    <FormControl w="70%">
                      <NumberInput
                        max={520}
                        min={0}
                        onChange={(valueString) => setCheckWordId(valueString)}
                      >
                        <NumberInputField id="amount" placeholder="0" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <Button
                      onClick={handleCheckWord}
                      bg={"#0189ca"}
                      size={"md"}
                      w={"70%"}
                    >
                      <Text color={"whiteAlpha.900"}>Check Word</Text>
                    </Button>
                    <Heading
                      fontSize={{
                        base: 10, // 0-48em
                        md: 20, // 48em-80em,
                        xl: 30, // 80em+
                      }}
                      pt={"20px"}
                      pb={"20px"}
                    >
                      Get Help
                    </Heading>
                    <Button
                      onClick={handleRevealLetter}
                      bg={"#0189ca"}
                      size={"md"}
                      w={"70%"}
                    >
                      <Text color={"whiteAlpha.900"}>
                        Reveal Square -{">"} Cost: 10 MJ
                      </Text>
                    </Button>
                    {squareWaiting ? (
                      <Flex alignItems={"center"}>
                        <Text marginRight="2">Revealing </Text>
                        <Spinner />
                      </Flex>
                    ) : (
                      ""
                    )}
                    <Button
                      onClick={handleRevealWord}
                      bg={"#0189ca"}
                      size={"md"}
                      w={"70%"}
                    >
                      {" "}
                      <Text color={"whiteAlpha.900"}>
                        Reveal Word -{">"} Cost: 15 MJ
                      </Text>
                    </Button>
                    {revWordWaiting ? (
                      <Flex alignItems={"center"}>
                        <Text marginRight="2">Revealing </Text>
                        <Spinner />
                      </Flex>
                    ) : (
                      ""
                    )}
                    <Button
                      onClick={reset}
                      bg={"#0189ca"}
                      size={"md"}
                      w={"70%"}
                    >
                      <Text color={"whiteAlpha.900"}>Reset Crossword</Text>
                    </Button>
                  </VStack>
                </Box>
              </HStack>
            </Flex>
          </Box>
        </Box>
      );
    } else {
      return <Error />;
    }
  }
}

export default CrosswordPuzzle;
