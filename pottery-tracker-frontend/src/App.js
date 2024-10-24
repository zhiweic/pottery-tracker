import React from 'react';
import { ChakraProvider, Box, Heading } from '@chakra-ui/react';
import PotteryModal from './components/PotteryModal';
import PotteryGallery from './components/PotteryGallery';

const App = () => {
  return (
    <ChakraProvider>
      <Box className="App" padding="4" maxW="1200px" margin="auto">
        <header>
          <Heading as="h1" size="xl" mb={4}>
            Welcome to Pottery Management
          </Heading>
          <PotteryModal /> {/* Add the button here */}
        </header>
        <main>
          {/* Render the PotteryGallery component */}
          <PotteryGallery />
        </main>
      </Box>
    </ChakraProvider>
  );
};

export default App;
