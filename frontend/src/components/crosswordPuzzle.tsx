import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Crossword from "@jaredreisinger/react-crossword";
import { crosswordList } from "../constants/dummyData/crosswordList";
import { CluesInputOriginal } from "@jaredreisinger/react-crossword/dist/types";
import { Error } from "../components/error";
import { Loading } from "../components/loading";
type CrosswordParams = {
  id: string;
};
function CrosswordPuzzle() {
  let { id } = useParams<CrosswordParams>();
  const [loading, setLoading] = useState(true);
  const [crosswordData, setCrosswordData] = useState<CluesInputOriginal>();
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
    fetchData();
  }, [id]);
  if (loading) {
    return <Box>Loading!</Box>;
  } else {
    if (crosswordData) {
      return (
        <>
          <Flex justifyContent="center" alignItems="center" pt={"20px"}>
            <Box boxSize={"md"}>
              <Flex justifyContent="center" alignItems="center" pt={"20px"}>
                <Heading
                  fontSize={{
                    base: 20, // 0-48em
                    md: 44, // 48em-80em,
                    xl: 54, // 80em+
                  }}
                  letterSpacing="6px"
                >
                  Title
                </Heading>
              </Flex>
              <Crossword data={crosswordData!} />
            </Box>
          </Flex>
        </>
      );
    } else {
      return <div>error</div>;
    }
  }
}

export default CrosswordPuzzle;
