import React from "react";
import { Box, Text, Flex, Heading, Link } from "@chakra-ui/react";
import { Link as ReactRouter } from "react-router-dom";
import globeBanner from "../../../constants/images/globeBanner.png";

import { Logo } from "../../../components/logo";
import { Header } from "../../../components/header";
export const Intro = () => {
  return (
    <Box>
      <Box
        backgroundPosition="center"
        backgroundImage={`url(${globeBanner})`}
        backgroundSize={"cover"}
      >
        <Header />
        <Box
          w="full"
          px={{
            base: "50px",
            md: "100px",
            xl: "200px",
          }}
          py="450px"
        >
          <Flex justifyContent="center" alignItems="center" marginLeft={"60%"}>
            <Heading
              fontSize={{
                base: 30,
                md: 40,
                xl: 50,
              }}
              color="whiteAlpha.900"
              fontWeight={"900"}
            >
              Taking your game to the next level on Web3
            </Heading>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
