import { ReactNode } from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as ReactRouter } from "react-router-dom";
import { Logo } from "./logo";
import { useState } from "react";
declare var window: any;
const Links = ["Games", "Create", "Team"];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    color={"whiteAlpha.900"}
    _hover={{
      textDecoration: "none",
      bg: "whiteAlpha.900",
    }}
    to={`/${children}`}
    as={ReactRouter}
  >
    {children}
  </Link>
);

export const Header = () => {
  const [account, setAccountState] = useState("");
  const connectUsersMeta = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  };
  let handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let account0 = await connectUsersMeta();
    setAccountState(account0);
  };

  window.ethereum.on("accountsChanged", function (accounts: Array<string>) {
    setAccountState(accounts[0]);
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue("blue.900", "blue.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Logo />
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {!account ? (
              <Button onClick={handleSubmit}>Connect Wallet</Button>
            ) : (
              <Button fontSize={15} letterSpacing="1.5px">
                Connected: {account.substring(2, 6)} ...
                {account.substring(37, 41)}
              </Button>
            )}
          </Flex>
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
