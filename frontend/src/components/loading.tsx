import React from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
export function Loading(props:any) {
  return (
    <Flex justifyContent="center" alignItems="center" height="800px">
      <Heading>{props.msg}</Heading>
      <Spinner size="lg" />
    </Flex>
  );
}
