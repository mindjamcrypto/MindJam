import React from "react";
import { Flex, Heading, Link, Image } from "@chakra-ui/react";
import { Link as ReactRouter } from "react-router-dom";
import levelUp from "../constants/images/levelUp.png";
export const Logo = () => {
  return (
    <Flex alignItems="flex-end">
      <Heading color="whiteAlpha.900" mr="60px">
        <Link as={ReactRouter} to="/">
          <Image
            boxSize={{
              base: "100px",
              md: "150px",
              xl: "200px",
            }}
            src={levelUp}
            marginBottom={{
              base: "-36px",
              md: "-86px",
              xl: "-136px",
            }}
          />
        </Link>
      </Heading>
    </Flex>
  );
};
