import React from "react";
import { Box, Text, Flex, Heading, Link } from "@chakra-ui/react";
import { Link as ReactRouter } from "react-router-dom";
import globeBanner from "../../../constants/images/globeBanner.png";
import { url } from "inspector";
import { Header } from "../../../components/header";
export const Intro = () => {
  return (
    <Box backgroundPosition="center" backgroundImage={`url(${globeBanner})`}>
      <Header />
      <Box
        w="full"
        px={{
          base: "50px",
          md: "100px",
          xl: "200px",
        }}
        py="400px"
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
            bg={"#94fc64"}
            color={"blackAlpha.900"}
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
    </Box>
  );
};
