import React, { useState } from 'react'
import {
  useGetEventsQuery,
  useGetOffersQuery,
  useCreateEventOfferLinkMutation,
} from '../services/api'
import type { EventOfferCreate } from '../services/api'
import {
  Box,
  Button,
  Card,
  Field,
  Heading,
  Input,
  Stack,
  createToaster,
} from '@chakra-ui/react'

const toaster = createToaster({
  placement: 'bottom-end',
  duration: 3000,
})

const EventOfferLinks: React.FC = () => {
  const { data: events } = useGetEventsQuery({})
  const { data: offers } = useGetOffersQuery({})
  const [createLink] = useCreateEventOfferLinkMutation()
  
  const [newLink, setNewLink] = useState<Omit<EventOfferCreate, 'event_id' | 'offer_id'>>({
    delay_minutes: 0,
    action_type: 'enable',
  })
  
  const [selectedEventId, setSelectedEventId] = useState('')
  const [selectedOfferId, setSelectedOfferId] = useState('')

  const handleCreateLink = async () => {
    if (!selectedEventId || !selectedOfferId) {
      toaster.warning({
        title: 'Selection required.',
        description: 'Please select both an event and an offer.',
      })
      return
    }
    
    try {
      await createLink({
        event_id: selectedEventId,
        offer_id: selectedOfferId,
        ...newLink,
      }).unwrap()
      
      // Reset form
      setSelectedEventId('')
      setSelectedOfferId('')
      setNewLink({
        delay_minutes: 0,
        action_type: 'enable',
      })
      
      toaster.success({
        title: 'Link created.',
        description: 'The event-offer link has been created successfully.',
      })
    } catch (err) {
      console.error('Failed to create link:', err)
      toaster.error({
        title: 'Error creating link.',
        description: 'There was an error creating the link.',
      })
    }
  }

  return (
    <Box>
      <Card.Root>
        <Card.Header>
          <Heading as="h2" size="lg">Event-Offer Links</Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap={6} align="stretch">
            <Box>
              <Heading as="h3" size="md" mb={4}>Create New Link</Heading>
              <Stack gap={4}>
                <Field.Root required>
                  <Field.Label>Event</Field.Label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">Select an Event</option>
                    {events?.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.name} ({event.code})
                      </option>
                    ))}
                  </select>
                </Field.Root>
                
                <Field.Root required>
                  <Field.Label>Offer</Field.Label>
                  <select
                    value={selectedOfferId}
                    onChange={(e) => setSelectedOfferId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '14px',
                    }}
                  >
                    <option value="">Select an Offer</option>
                    {offers?.map(offer => (
                      <option key={offer.id} value={offer.id}>
                        {offer.name} ({offer.code})
                      </option>
                    ))}
                  </select>
                </Field.Root>
                
                <Field.Root>
                  <Field.Label>Delay Minutes</Field.Label>
                  <Input
                    type="number"
                    placeholder="Delay Minutes"
                    value={newLink.delay_minutes || 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLink({...newLink, delay_minutes: parseInt(e.target.value) || 0})}
                  />
                </Field.Root>
                
                <Field.Root>
                  <Field.Label>Action Type</Field.Label>
                  <Input
                    placeholder="Action Type"
                    value={newLink.action_type || 'enable'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLink({...newLink, action_type: e.target.value})}
                  />
                </Field.Root>
                
                <Button colorPalette="blue" onClick={handleCreateLink}>Create Link</Button>
              </Stack>
            </Box>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}

export default EventOfferLinks