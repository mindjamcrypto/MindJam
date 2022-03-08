import React from "react";
import { Flex, Heading, Link, Image } from "@chakra-ui/react";
import { Link as ReactRouter } from "react-router-dom";
import logo from "../constants/images/officialLogo.png";
export const Logo = () => {
  return (
    <Flex alignItems="flex-end">
      <Heading color="whiteAlpha.900" mr="60px">
        <Link as={ReactRouter} to="/">
          <Image boxSize="70px" src={logo} mt="-2.5" />
        </Link>
      </Heading>
    </Flex>
  );
};
