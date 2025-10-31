import React, { useState } from 'react'
import {
  useGetEventsQuery,
  useCreateEventMutation,
  useDeleteEventMutation,
} from '../services/api'
import type { Event, EventCreate } from '../services/api'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Field,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  createToaster,
} from '@chakra-ui/react'

const toaster = createToaster({
  placement: 'bottom-end',
  duration: 3000,
})

const EventsList: React.FC = () => {
  const { data: events, error, isLoading, refetch } = useGetEventsQuery({})
  const [createEvent] = useCreateEventMutation()
  const [deleteEvent] = useDeleteEventMutation()
  
  const [newEvent, setNewEvent] = useState<Omit<EventCreate, 'id'>>({
    code: '',
    name: '',
    description: '',
    lifetime_hours: 0,
    disable_all_campaigns: false,
    queue_name: 'default_queue',
  })
  
  const [eventIdCounter, setEventIdCounter] = useState(1)

  const handleCreateEvent = async () => {
    try {
      await createEvent({
        ...newEvent,
        id: `event-${eventIdCounter}`,
      } as EventCreate).unwrap()
      setEventIdCounter(eventIdCounter + 1)
      setNewEvent({
        code: '',
        name: '',
        description: '',
        lifetime_hours: 0,
        disable_all_campaigns: false,
        queue_name: 'default_queue',
      })
      refetch()
      toaster.success({
        title: 'Event created.',
        description: 'The event has been created successfully.',
      })
    } catch (err) {
      console.error('Failed to create event:', err)
      toaster.error({
        title: 'Error creating event.',
        description: 'There was an error creating the event.',
      })
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id).unwrap()
      refetch()
      toaster.success({
        title: 'Event deleted.',
        description: 'The event has been deleted successfully.',
      })
    } catch (err) {
      console.error('Failed to delete event:', err)
      toaster.error({
        title: 'Error deleting event.',
        description: 'There was an error deleting the event.',
      })
    }
  }

  if (isLoading) return <Text>Loading events...</Text>
  if (error) return <Text color="red.500">Error loading events</Text>

  return (
    <Box>
      <Card.Root>
        <Card.Header>
          <Heading as="h2" size="lg">Events</Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap={6} align="stretch">
            <Box>
              <Heading as="h3" size="md" mb={4}>Create New Event</Heading>
              <Stack gap={4}>
                <Field.Root required>
                  <Field.Label>Code</Field.Label>
                  <Input
                    placeholder="Code"
                    value={newEvent.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEvent({...newEvent, code: e.target.value})}
                  />
                </Field.Root>
                
                <Field.Root required>
                  <Field.Label>Name</Field.Label>
                  <Input
                    placeholder="Name"
                    value={newEvent.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEvent({...newEvent, name: e.target.value})}
                  />
                </Field.Root>
                
                <Field.Root>
                  <Field.Label>Description</Field.Label>
                  <Input
                    placeholder="Description"
                    value={newEvent.description || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEvent({...newEvent, description: e.target.value})}
                  />
                </Field.Root>
                
                <Field.Root>
                  <Field.Label>Lifetime Hours</Field.Label>
                  <Input
                    type="number"
                    placeholder="Lifetime Hours"
                    value={newEvent.lifetime_hours || 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEvent({...newEvent, lifetime_hours: parseInt(e.target.value) || 0})}
                  />
                </Field.Root>
                
                <Flex gap={2} alignItems="center">
                  <Checkbox.Root
                    checked={newEvent.disable_all_campaigns || false}
                    onCheckedChange={(details) => setNewEvent({...newEvent, disable_all_campaigns: !!details.checked})}
                  >
                    <Checkbox.Control />
                    <Checkbox.Label>Disable All Campaigns</Checkbox.Label>
                  </Checkbox.Root>
                </Flex>
                
                <Field.Root>
                  <Field.Label>Queue Name</Field.Label>
                  <Input
                    placeholder="Queue Name"
                    value={newEvent.queue_name || 'default_queue'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEvent({...newEvent, queue_name: e.target.value})}
                  />
                </Field.Root>
                
                <Button colorPalette="blue" onClick={handleCreateEvent}>Create Event</Button>
              </Stack>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {events?.map((event: Event) => (
                <Card.Root key={event.id} variant="outline">
                  <Card.Header pb={2}>
                    <Heading as="h4" size="sm">{event.name}</Heading>
                    <Text fontSize="sm" color="gray.500">({event.code})</Text>
                  </Card.Header>
                  <Card.Body pt={2}>
                    <Text mb={2}>{event.description}</Text>
                    <Text fontSize="xs" color="gray.500">
                      Created: {new Date(event.created_at).toLocaleString()}
                    </Text>
                    <Button 
                      size="sm" 
                      colorPalette="red" 
                      mt={3}
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}

export default EventsList