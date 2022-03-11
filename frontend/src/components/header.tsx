import { ReactNode } from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  Stack,
  Heading,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as ReactRouter } from "react-router-dom";
import { Logo } from "../components/logo";
declare var window: any;
const Links = ["GAMES", "CREATE", "TEAM"];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    color={"whiteAlpha.900"}
    _hover={{
      textDecoration: "none",
      bg: "blackAlpha.400",
    }}
    bg={"blue.900"}
    fontWeight={"540"}
    to={`/${children}`}
    as={ReactRouter}
  >
    {children}
  </Link>
);

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box>
        <Logo />
        <Flex h={16}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            marginLeft="auto"
            mt={"10px"}
          />
          <HStack
            as={"nav"}
            spacing={10}
            display={{ base: "none", md: "flex" }}
            marginLeft="250px"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};
