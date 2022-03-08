import React from "react";
import { Box, Text, Flex, Heading, HStack } from "@chakra-ui/react";
import levelUp from "../../../constants/images/levelUp.png";
export const About = () => {
  return (
    <Box
      w="full"
      bg="#a7fc5a"
      px={{
        base: "50px", // 0-48em
        md: "100px", // 48em-80em,
        xl: "200px", // 80em+
      }}
      py="60px"
    >
      <HStack w="full" spacing="60px">
        <Flex justifyContent="center" alignItems="center">
          <Heading
            fontSize={{
              base: 20, // 0-48em
              md: 44, // 48em-80em,
              xl: 54, // 80em+
            }}
            letterSpacing="6px"
            color="#0f3775"
          >
            A platform for mind games and mind-building content!
          </Heading>
        </Flex>
        <Flex justifyContent="center" alignItems="center" pb="30px">
          <Box boxSize="sm">
            <img src={levelUp} alt="BigCo Inc. logo" />
          </Box>
        </Flex>
      </HStack>
    </Box>
  );
};

// MindJam is a platform for mind games and mind-building content - crossword puzzles, memory challenges, educational games, and more - all available via the blockchain.

// Players can connect their wallet to access games for free via a web interface and opt to pay a small fee for clues or access to answers.

// Creators can tap into the MindJam platform and submit their own unique games for free and tap into a mind game ecosystem of players and share in the revenue earned.
