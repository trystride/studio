
import type { Business, Event, GeoLocation } from '@/lib/types';

// Mock data
const mockBusinesses: Business[] = [
  {
    _id: 'biz1',
    name: 'Cool Cafe',
    address: '123 Main St, Anytown, USA',
    location: { type: 'Point', coordinates: [-122.4194, 37.7749] }, // SF
    category: 'Cafe',
    description: 'The best coffee in town.',
    currentPromotion: { title: '20% off Lattes', details: 'Valid Mon-Fri, 8-10 AM', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
    owner: 'owner1',
  },
  {
    _id: 'biz2',
    name: 'Tech Hub',
    address: '456 Tech Rd, Anytown, USA',
    location: { type: 'Point', coordinates: [-122.4250, 37.7755] }, // Near SF
    category: 'Electronics',
    description: 'Latest gadgets and tech support.',
    owner: 'owner2',
  },
];

const mockEvents: Event[] = [
  {
    _id: 'evt1',
    title: 'Live Music Night',
    description: 'Join us for an evening of great music and fun.',
    location: { type: 'Point', coordinates: [-122.4180, 37.7780] }, // SF
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    creator: 'user1',
    interestedCount: 25,
  },
  {
    _id: 'evt2',
    title: 'Farmers Market',
    description: 'Fresh produce and local goods.',
    location: { type: 'Point', coordinates: [-122.4220, 37.7720] }, // SF
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    creator: 'user2',
    interestedCount: 120,
  },
];

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

// Simulate API delay
const apiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchBusinessesInView = async (bounds?: Bounds): Promise<Business[]> => {
  await apiDelay(500);
  if (!bounds) return mockBusinesses;
  // Simple mock filter based on bounds
  return mockBusinesses.filter(biz => 
    biz.location.coordinates[1] >= bounds.minLat &&
    biz.location.coordinates[1] <= bounds.maxLat &&
    biz.location.coordinates[0] >= bounds.minLng &&
    biz.location.coordinates[0] <= bounds.maxLng
  );
};

export const fetchEventsInView = async (bounds?: Bounds): Promise<Event[]> => {
  await apiDelay(500);
   if (!bounds) return mockEvents;
  return mockEvents.filter(evt => 
    evt.location.coordinates[1] >= bounds.minLat &&
    evt.location.coordinates[1] <= bounds.maxLat &&
    evt.location.coordinates[0] >= bounds.minLng &&
    evt.location.coordinates[0] <= bounds.maxLng
  );
};

export const createNewEvent = async (eventData: Omit<Event, '_id' | 'creator' | 'interestedCount'> & { creator: string }): Promise<Event> => {
  await apiDelay(1000);
  const newEvent: Event = {
    ...eventData,
    _id: `evt${Date.now()}`,
    interestedCount: 0,
  };
  mockEvents.push(newEvent);
  console.log('Created new event (mock):', newEvent);
  return newEvent;
};

export const createNewBusiness = async (businessData: Omit<Business, '_id' | 'owner'> & { owner: string }): Promise<Business> => {
  await apiDelay(1000);
  const newBusiness: Business = {
    ...businessData,
    _id: `biz${Date.now()}`,
  };
  mockBusinesses.push(newBusiness);
  console.log('Created new business (mock):', newBusiness);
  return newBusiness;
};

export const updatePromotion = async (businessId: string, promotionData: Business['currentPromotion']): Promise<Business> => {
  await apiDelay(700);
  const businessIndex = mockBusinesses.findIndex(b => b._id === businessId);
  if (businessIndex === -1) throw new Error('Business not found');
  
  mockBusinesses[businessIndex].currentPromotion = promotionData;
  console.log('Updated promotion for business (mock):', mockBusinesses[businessIndex]);
  return mockBusinesses[businessIndex];
};

// Add other mock API functions (login, signup are handled in forms/AuthContext for this mock)
