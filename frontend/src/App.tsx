import { Box, Container, Heading, Stack, Flex } from '@chakra-ui/react'
import EventsList from './components/EventsList'
import OffersList from './components/OffersList'
import EventOfferLinks from './components/EventOfferLinks'
import AuthWrapper from './auth/AuthWrapper'
import LoginLogoutButton from './auth/LoginLogoutButton'

function App() {
  console.log('App component rendering');
  
  return (
    <AuthWrapper>
      <Container maxW="container.xl" py={8}>
        <Stack gap={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Box textAlign="center" py={4}>
              <Heading as="h1" size="xl">Event-Offer Management System</Heading>
            </Box>
            <LoginLogoutButton />
          </Flex>
          <EventsList />
          <OffersList />
          <EventOfferLinks />
        </Stack>
      </Container>
    </AuthWrapper>
  )
}

export default App
