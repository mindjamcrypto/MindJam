import React from "react";
import { Box, Text, Flex, Heading, Link } from "@chakra-ui/react";
import { Link as ReactRouter } from "react-router-dom";
export const Intro = () => {
  return (
    <Box
      w="full"
      bg="blue.900"
      px={{
        base: "50px",
        md: "100px",
        xl: "200px",
      }}
      py="60px"
    >
      <Flex justifyContent="center" alignItems="center">
        <Heading
          fontSize={{
            base: 30,
            md: 54,
            xl: 64,
          }}
          letterSpacing="6px"
          color="whiteAlpha.900"
        >
          MindJam
        </Heading>
      </Flex>
      <Flex justifyContent="center" alignItems="center" pb="30px">
        <Box
          fontSize={{
            base: 20,
            md: 30,
            xl: 40,
          }}
          letterSpacing="6px"
          color="whiteAlpha.900"
        >
          Mind Games on the Blockchain
        </Box>
      </Flex>
      <Flex justifyContent="center" alignItems="center" pb="30px">
        <Link
          px={2}
          py={1}
          rounded={"md"}
          bg={"purple.400"}
          color={"whiteAlpha.900"}
          fontSize={"30px"}
          _hover={{
            textDecoration: "none",
            bg: "whiteAlpha.900",
          }}
          as={ReactRouter}
          to={"/games"}
        >
          Start playing now!
        </Link>
      </Flex>
    </Box>
  );
};
