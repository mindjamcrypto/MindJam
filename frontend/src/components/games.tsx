import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Link,
  Heading,
} from "@chakra-ui/react";
import { Link as ReactRouter } from "react-router-dom";
export const Games = () => {
  const gameList = ["Crossword", "Wordle", "Word Scramble", "Learn French"];
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
          Choose a game!
        </Heading>
      </Flex>
      <Flex justifyContent="center" alignItems="center">
        <Grid templateColumns="repeat(2, 1fr)" gap={12}>
          {gameList?.map((game) => (
            <GridItem key={game}>
              <Button>
                <Link as={ReactRouter} to={`/${game}selection`}>
                  {game}
                </Link>
              </Button>
            </GridItem>
          ))}
        </Grid>
      </Flex>
    </Box>
  );
};
