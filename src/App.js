// src/App.js
import React from 'react';
import './App.css';
import WordGuessingGame from './WordGuessingGame';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <WordGuessingGame />
      </div>
    </ChakraProvider>
  );
}

export default App;
