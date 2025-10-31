import { Box, Container, Heading, Stack } from '@chakra-ui/react'
import EventsList from './components/EventsList'
import OffersList from './components/OffersList'
import EventOfferLinks from './components/EventOfferLinks'

function App() {
  return (
    <Container maxW="container.xl" py={8}>
      <Stack gap={8} align="stretch">
        <Box textAlign="center" py={4}>
          <Heading as="h1" size="xl">Event-Offer Management System</Heading>
        </Box>
        <EventsList />
        <OffersList />
        <EventOfferLinks />
      </Stack>
    </Container>
  )
}

export default App
