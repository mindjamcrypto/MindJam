import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/landing/landing";
import { Header } from "./components/header";
import { Games } from "./components/games";
import { Create } from "./components/create";
import CrosswordPuzzle from "./components/crosswordPuzzle";
import { CrosswordSelection } from "./components/crosswordSelection";

export const App = () => (
  <ChakraProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/games" element={<Games />}></Route>
        <Route path="/create" element={<Create />}></Route>
        <Route
          path="/crosswordSelection"
          element={<CrosswordSelection />}
        ></Route>
        <Route path="/crossword/:id" element={<CrosswordPuzzle />}></Route>
      </Routes>
    </Router>
  </ChakraProvider>
);
