import React from "react";
import { Box, Text, Flex, Heading, HStack, VStack } from "@chakra-ui/react";
import winnerLogo from "../../../constants/images/winnerLogo.png";
export const About = () => {
  return (
    <Box
      w="full"
      bg="whiteAlpha.900"
      px={{
        base: "50px", // 0-48em
        md: "100px", // 48em-80em,
        xl: "200px", // 80em+
      }}
      py="100px"
    >
      <HStack w="full" spacing="60px">
        <Box>
          <Flex justifyContent="center" alignItems="center">
            <VStack>
              <Heading
                fontSize={{
                  base: 20, // 0-48em
                  md: 44, // 48em-80em,
                  xl: 54, // 80em+
                }}
                color="blackAlpha.900"
              >
                ABOUT US
              </Heading>
              <Text textAlign={"center"}>
                LEVEL UP FOR cruciverbalists and enigmatologists
                <br />
                <br />
                Or simply put
                <br />
                <br />
                All you crossword whizzes and ming game fanatics
                <br />
                <br />
                This is the WEB3 MindJam Game that takes you across the
                boundaries of everyday gaming
                <br />
                <br />
                We keep your brain entertained and bring you fun and crypto
                <br />
                <br />
                The clock is ticking when the game is release, you have 24 hours
                to compete and complete the quickest to submit will be paid Jam
                after final entries
              </Text>
            </VStack>
          </Flex>
        </Box>
        <Flex justifyContent="center" alignItems="center" pb="30px">
          <Box boxSize="sm">
            <img src={winnerLogo} alt="BigCo Inc. logo" />
          </Box>
        </Flex>
      </HStack>
    </Box>
  );
};

// MindJam is a platform for mind games and mind-building content - crossword puzzles, memory challenges, educational games, and more - all available via the blockchain.

// Players can connect their wallet to access games for free via a web interface and opt to pay a small fee for clues or access to answers.

// Creators can tap into the MindJam platform and submit their own unique games for free and tap into a mind game ecosystem of players and share in the revenue earned.
