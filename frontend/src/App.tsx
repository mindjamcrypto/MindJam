import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Landing } from "./pages/landing/landing";
import { Header } from "./components/header";
import { Games } from "./components/games";

export const App = () => (
  <ChakraProvider>
    <Header />
    <Router>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/games" element={<Games />}></Route>
      </Routes>
    </Router>
  </ChakraProvider>
);
