import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Link,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link as ReactRouter } from "react-router-dom";
import axios from "axios";
import { Error } from "../components/error";
import { Loading } from "../components/loading";

export const Create = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [across, setAcross] = useState("");
  const [down, setDown] = useState("");

  const handleSubmit = async () => {
    //WRITE REGEX To seperate in to proper format
    console.log("Stuff to submit", title, across, down);
  };

  return (
    <Box
      w="full"
      bg="whiteAlpha.900"
      px={{
        base: "50px", // 0-48em
        md: "100px", // 48em-80em,
        xl: "200px", // 80em+
      }}
      py="60px"
    >
      <Flex justifyContent="center" alignItems="center">
        <Heading
          fontSize={{
            base: 20, // 0-48em
            md: 44, // 48em-80em,
            xl: 54, // 80em+
          }}
          letterSpacing="6px"
          pb="15px"
        >
          Create your own puzzle!
        </Heading>
      </Flex>
      <Flex justifyContent="center" alignItems="center">
        <FormControl>
          <FormLabel
            htmlFor="title"
            onChange={(valueString) => setTitle(valueString)}
          >
            Title
          </FormLabel>
          <Input id="across" type="across" />
          <FormLabel
            htmlFor="across"
            pt={"10px"}
            onChange={(valueString) => setAcross(valueString)}
          >
            Across
          </FormLabel>
          <FormHelperText>
            Please input in correct format as shown below
          </FormHelperText>
          <Input
            id="down"
            type="down"
            placeholder="<Clue Number>. <clue>, <answer>, <row#>, <col#>"
            onChange={(valueString) => setDown(valueString)}
          />

          <FormLabel htmlFor="down" pt={"10px"}>
            Down
          </FormLabel>
          <FormHelperText>
            Please input in correct format as shown below
          </FormHelperText>
          <Input
            id="email"
            type="email"
            placeholder="<Clue Number>. <clue>, <answer>, <row#>, <col#>"
          />
          <Button onClick={handleSubmit} pt={"10px"}>
            Create puzzle
          </Button>
        </FormControl>
      </Flex>
    </Box>
  );
};
