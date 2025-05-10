export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Business {
  _id: string;
  name: string;
  address: string;
  location: GeoLocation;
  category: string;
  description?: string;
  currentPromotion?: {
    title: string;
    details: string;
    expiresAt?: string; // ISO date string
  };
  owner: string; // User ID
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  location: GeoLocation;
  startTime: string; // ISO date string
  endTime?: string; // ISO date string
  isPublic: boolean;
  creator: string; // User ID
  interestedCount: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'business_owner' | 'admin';
}

export type MapItem = (Business & { type: 'business' }) | (Event & { type: 'event' });
