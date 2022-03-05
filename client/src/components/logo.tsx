import React from "react";
import { Flex, Heading, Link } from "@chakra-ui/react";

export const Logo = () => {
  return (
    <Flex alignItems="flex-end">
      <Heading
        color="whiteAlpha.900"
        mr="60px"
        fontSize={20}
        letterSpacing="1.5px"
      >
        <Link href="/">Logo</Link>
      </Heading>
    </Flex>
  );
};
