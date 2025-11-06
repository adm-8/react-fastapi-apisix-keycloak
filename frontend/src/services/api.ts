import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define types based on the OpenAPI spec
export interface Event {
  id: string
  code: string
  name: string
  description?: string | null
  lifetime_hours?: number | null
  disable_all_campaigns?: boolean | null
  queue_name?: string | null
  created_at: string
  updated_at: string
}

export interface EventCreate {
  id: string
  code: string
  name: string
  description?: string | null
  lifetime_hours?: number | null
  disable_all_campaigns?: boolean | null
  queue_name?: string | null
}

export interface EventUpdate {
  code: string
  name: string
  description?: string | null
  lifetime_hours?: number | null
  disable_all_campaigns?: boolean | null
  queue_name?: string | null
}

export interface Offer {
  id: string
  code: string
  name: string
  description?: string | null
  priority?: number | null
  target_system?: string | null
  created_at: string
  updated_at: string
}

export interface OfferCreate {
  id: string
  code: string
  name: string
  description?: string | null
  priority?: number | null
  target_system?: string | null
}

export interface OfferUpdate {
  code: string
  name: string
  description?: string | null
  priority?: number | null
  target_system?: string | null
}

export interface EventOfferCreate {
  event_id: string
  offer_id: string
  delay_minutes?: number | null
  action_type?: string | null
}

export interface EventOfferUpdate {
  delay_minutes?: number | null
  action_type?: string | null
}

// Custom base query that adds the auth token to requests
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers) => {
    // Get the OIDC authentication object from localStorage
    const authString = localStorage.getItem('oidc.user:http://localhost:8080/realms/myrealm:frontend-client');
    console.log('API service: Checking for auth token in localStorage');
    
    if (authString) {
      try {
        const auth = JSON.parse(authString);
        console.log('API service: Found auth data in localStorage', auth);
        
        if (auth.access_token) {
          console.log('API service: Adding access token to request headers');
          // Add the access token to the headers
          headers.set('Authorization', `Bearer ${auth.access_token}`);
        } else {
          console.log('API service: No access token found in auth data');
        }
      } catch (e) {
        console.error('API service: Error parsing auth data:', e);
      }
    } else {
      console.log('API service: No auth data found in localStorage');
    }
    
    return headers;
  },
});

export const api = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Event', 'Offer'],
  endpoints: (builder) => ({
    // Events endpoints
    getEvents: builder.query<Event[], { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 100 }) => `events/?skip=${skip}&limit=${limit}`,
      providesTags: (_result) =>
        _result
          ? [..._result.map(({ id }) => ({ type: 'Event' as const, id })), 'Event']
          : ['Event'],
    }),
    getEvent: builder.query<Event, string>({
      query: (eventId) => `events/${eventId}`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation<Event, EventCreate>({
      query: (newEvent) => ({
        url: 'events/',
        method: 'POST',
        body: newEvent,
      }),
      invalidatesTags: ['Event'],
    }),
    updateEvent: builder.mutation<Event, { id: string; data: EventUpdate }>({
      query: ({ id, data }) => ({
        url: `events/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Event', id }],
    }),
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),

    // Offers endpoints
    getOffers: builder.query<Offer[], { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 100 }) => `offers/?skip=${skip}&limit=${limit}`,
      providesTags: (_result) =>
        _result
          ? [..._result.map(({ id }) => ({ type: 'Offer' as const, id })), 'Offer']
          : ['Offer'],
    }),
    getOffer: builder.query<Offer, string>({
      query: (offerId) => `offers/${offerId}`,
      providesTags: (_result, _error, id) => [{ type: 'Offer', id }],
    }),
    createOffer: builder.mutation<Offer, OfferCreate>({
      query: (newOffer) => ({
        url: 'offers/',
        method: 'POST',
        body: newOffer,
      }),
      invalidatesTags: ['Offer'],
    }),
    updateOffer: builder.mutation<Offer, { id: string; data: OfferUpdate }>({
      query: ({ id, data }) => ({
        url: `offers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Offer', id }],
    }),
    deleteOffer: builder.mutation<void, string>({
      query: (id) => ({
        url: `offers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Offer', id }],
    }),

    // Event-Offer endpoints
    createEventOfferLink: builder.mutation<EventOfferCreate, EventOfferCreate>({
      query: (link) => ({
        url: 'event-offers/',
        method: 'POST',
        body: link,
      }),
    }),
    updateEventOfferLink: builder.mutation<
      EventOfferUpdate,
      { eventId: string; offerId: string; data: EventOfferUpdate }
    >({
      query: ({ eventId, offerId, data }) => ({
        url: `event-offers/${eventId}/${offerId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteEventOfferLink: builder.mutation<
      void,
      { eventId: string; offerId: string }
    >({
      query: ({ eventId, offerId }) => ({
        url: `event-offers/${eventId}/${offerId}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetOffersQuery,
  useGetOfferQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
  useCreateEventOfferLinkMutation,
  useUpdateEventOfferLinkMutation,
  useDeleteEventOfferLinkMutation,
} = api