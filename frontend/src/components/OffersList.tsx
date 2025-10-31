import React, { useState } from 'react'
import {
  useGetOffersQuery,
  useCreateOfferMutation,
  useDeleteOfferMutation,
} from '../services/api'
import type { Offer, OfferCreate } from '../services/api'
import {
  Box,
  Button,
  Card,
  Field,
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

const OffersList: React.FC = () => {
  const { data: offers, error, isLoading, refetch } = useGetOffersQuery({})
  const [createOffer] = useCreateOfferMutation()
  const [deleteOffer] = useDeleteOfferMutation()
  
  const [newOffer, setNewOffer] = useState<Omit<OfferCreate, 'id'>>({
    code: '',
    name: '',
    description: '',
    priority: 1,
    target_system: 'default_system',
  })

  const handleCreateOffer = async () => {
    try {
      // Generate a unique ID for the offer
      const offerWithId: OfferCreate = {
        ...newOffer,
        id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }
      
      await createOffer(offerWithId).unwrap()
      setNewOffer({
        code: '',
        name: '',
        description: '',
        priority: 1,
        target_system: 'default_system',
      })
      refetch()
      toaster.success({
        title: 'Offer created.',
        description: 'The offer has been created successfully.',
      })
    } catch (err) {
      console.error('Failed to create offer:', err)
      toaster.error({
        title: 'Error creating offer.',
        description: 'There was an error creating the offer.',
      })
    }
  }

  const handleDeleteOffer = async (id: string) => {
    try {
      await deleteOffer(id).unwrap()
      refetch()
      toaster.success({
        title: 'Offer deleted.',
        description: 'The offer has been deleted successfully.',
      })
    } catch (err) {
      console.error('Failed to delete offer:', err)
      toaster.error({
        title: 'Error deleting offer.',
        description: 'There was an error deleting the offer.',
      })
    }
  }

  if (isLoading) return <Text>Loading offers...</Text>
  if (error) return <Text color="red.500">Error loading offers</Text>

  return (
    <Box>
      <Card.Root>
        <Card.Header>
          <Heading as="h2" size="lg">Offers</Heading>
        </Card.Header>
        <Card.Body>
          <Stack gap={6} align="stretch">
            <Box>
              <Heading as="h3" size="md" mb={4}>Create New Offer</Heading>
              <Stack gap={4}>
                <Field.Root required>
                  <Field.Label>Code</Field.Label>
                  <Input
                    placeholder="Code"
                    value={newOffer.code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewOffer({...newOffer, code: e.target.value})}
                  />
                </Field.Root>
                
                <Field.Root required>
                  <Field.Label>Name</Field.Label>
                  <Input
                    placeholder="Name"
                    value={newOffer.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewOffer({...newOffer, name: e.target.value})}
                  />
                </Field.Root>
                
                <Field.Root>
                  <Field.Label>Description</Field.Label>
                  <Input
                    placeholder="Description"
                    value={newOffer.description || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewOffer({...newOffer, description: e.target.value})}
                  />
                </Field.Root>
                
                <Field.Root>
                  <Field.Label>Priority</Field.Label>
                  <Input
                    type="number"
                    placeholder="Priority"
                    value={newOffer.priority || 1}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewOffer({...newOffer, priority: parseInt(e.target.value) || 1})}
                  />
                </Field.Root>
                
                <Field.Root>
                  <Field.Label>Target System</Field.Label>
                  <Input
                    placeholder="Target System"
                    value={newOffer.target_system || 'default_system'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewOffer({...newOffer, target_system: e.target.value})}
                  />
                </Field.Root>
                
                <Button colorPalette="blue" onClick={handleCreateOffer}>Create Offer</Button>
              </Stack>
            </Box>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {offers?.map((offer: Offer) => (
                <Card.Root key={offer.id} variant="outline">
                  <Card.Header pb={2}>
                    <Heading as="h4" size="sm">{offer.name}</Heading>
                    <Text fontSize="sm" color="gray.500">({offer.code})</Text>
                  </Card.Header>
                  <Card.Body pt={2}>
                    <Text mb={2}>{offer.description}</Text>
                    <Text fontSize="xs" color="gray.500">
                      Created: {new Date(offer.created_at).toLocaleString()}
                    </Text>
                    <Button 
                      size="sm" 
                      colorPalette="red" 
                      mt={3}
                      onClick={() => handleDeleteOffer(offer.id)}
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

export default OffersList