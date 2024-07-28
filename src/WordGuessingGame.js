// src/WordGuessingGame.js
import React, { useState, useEffect } from 'react';
import { Alert, AlertIcon, AlertDescription, Box, Input, Button, Stack, Text, Heading, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import wordsData from './words.json';

const WordGuessingGame = () => {
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(() => {
    // Load attempts from localStorage
    const savedAttempts = localStorage.getItem('attempts');
    return savedAttempts ? JSON.parse(savedAttempts) : [];
  });
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const targetWord = 'шампуры';

  useEffect(() => {
    // Save attempts to localStorage
    localStorage.setItem('attempts', JSON.stringify(attempts));
  }, [attempts]);

  const handleGuess = () => {
    if (guess.trim() === '') return;
    setLoading(true);

    try {
      const similarity = wordsData[guess] !== undefined ? wordsData[guess] : 10001;

      if (similarity === 1) {
        onOpen();
      }

      setAttempts([...attempts, { word: guess, similarity }]);
      setGuess('');
    } catch (error) {
      console.error('Error processing guess:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleGuess();
    }
  };

  const clearAttempts = () => {
    setAttempts([]);
    localStorage.removeItem('attempts');
  };

  const getSimilarityColor = (similarity) => {
    if (similarity === 1) return '#4CAF50'; // Green
    if (similarity <= 100) return '#81C784'; // Light Green
    if (similarity <= 1000) return '#FFEB3B'; // Yellow
    if (similarity > 10000) return '#F44336'; // Red
    return '#F44336'; // Red
  };

  return (
    <Box maxW="md" mx="auto" mt="10" p="6" bg="white" rounded="lg" shadow="xl">
      <Heading as="h1" size="xl" mb="4" textAlign="center">Угадай слово</Heading>
      <Box mb="4">
        <Input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Введите ваше предположение"
          isDisabled={loading}
          mb="2"
          onKeyPress={handleKeyPress}
        />
      </Box>
      <Button
        onClick={handleGuess}
        w="full"
        colorScheme="blue"
        isLoading={loading}
      >
        Угадать
      </Button>
      <Button
        onClick={clearAttempts}
        w="full"
        mt="2"
        colorScheme="red"
      >
        Очистить попытки
      </Button>
      {attempts.length > 0 && (
        <Box mt="6">
          <Heading as="h2" size="lg" mb="2">Попытки:</Heading>
          <Stack spacing={2}>
            {attempts
              .sort((a, b) => a.similarity - b.similarity)
              .map((attempt, index) => (
                <Alert key={index} status="info">
                  <AlertIcon />
                  <AlertDescription>
                    <Text as="span" fontWeight="bold">{attempt.word}</Text>
                    <Text 
                      as="span"
                      ml="2"
                      px="2"
                      py="1"
                      rounded="md"
                      bg={getSimilarityColor(attempt.similarity)}
                      color="black" // Changed to black for better contrast
                      fontSize="sm"
                    >
                      {attempt.similarity > 10000 ? '>10000' : attempt.similarity}
                    </Text>
                  </AlertDescription>
                </Alert>
              ))}
          </Stack>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Поздравляем!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Ты победил, напиши в телеграм это слово чтобы получить подарок!
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WordGuessingGame;
