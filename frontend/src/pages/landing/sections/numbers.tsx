import React from "react";
import {
  Box,
  Text,
  Flex,
  Heading,
  Link,
  HStack,
  VStack,
} from "@chakra-ui/react";
export const Numbers = () => {
  return (
    <Box
      bg={"#060f35"}
      px={{
        base: "50px", // 0-48em
        md: "100px", // 48em-80em,
        xl: "200px", // 80em+
      }}
      py="30px"
    >
      <HStack w="full" spacing="100px" px={"80px"}>
        <Box maxH={"115px"}>
          <VStack>
            <Text fontSize={"40px"} color={"#0189ca"}>
              24
            </Text>
            <Text
              fontSize={"15px"}
              color={"whiteAlpha.900"}
              textAlign={"center"}
            >
              HOURS - THE QUICKEST THIME WING
            </Text>
          </VStack>
        </Box>
        <Box>
          <VStack>
            <Text fontSize={"40px"} color={"#0189ca"}>
              5
            </Text>
            <Text
              fontSize={"15px"}
              color={"whiteAlpha.900"}
              textAlign={"center"}
            >
              TOKENS FOR A WORD REVEAL
            </Text>
          </VStack>
        </Box>
        <Box>
          <VStack>
            <Text fontSize={"40px"} color={"#0189ca"}>
              1
            </Text>
            <Text
              fontSize={"15px"}
              color={"whiteAlpha.900"}
              textAlign={"center"}
            >
              TOKEN FOR A SQUARE REVEAL
            </Text>
          </VStack>
        </Box>
        <Box>
          <VStack>
            <Text fontSize={"40px"} color={"#0189ca"}>
              25
            </Text>
            <Text
              fontSize={"15px"}
              color={"whiteAlpha.900"}
              textAlign={"center"}
            >
              TOKENS FOR THE WINNER
            </Text>
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
};
