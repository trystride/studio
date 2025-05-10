
"use client";

import type { ReactNode } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

interface MapProviderProps {
  children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  // Ensure GOOGLE_MAPS_API_KEY is available for APIProvider
  // This key should be stored in .env.local (e.g., NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
  // Accessing process.env in a client component needs to be prefixed with NEXT_PUBLIC_
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    // This is a client component, so console.error will appear in browser console
    console.error("Google Maps API Key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file.");
    // You might want to render a message to the user if the key is missing during runtime
    // For now, we'll let APIProvider handle it or fallback to a default.
  }

  return (
    <APIProvider apiKey={googleMapsApiKey || ""}>
      {children}
    </APIProvider>
  );
}
