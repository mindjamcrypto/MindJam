import React from "react";
import { Flex, Heading, Link } from "@chakra-ui/react";
import { Link as ReactRouter } from "react-router-dom";
export const Logo = () => {
  return (
    <Flex alignItems="flex-end">
      <Heading
        color="whiteAlpha.900"
        mr="60px"
        fontSize={20}
        letterSpacing="1.5px"
      >
        <Link as={ReactRouter} to="/">
          Logo
        </Link>
      </Heading>
    </Flex>
  );
};
