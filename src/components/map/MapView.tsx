
"use client";

import type { Business, Event, MapItem } from '@/lib/types';
import { Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import React, { useState, useEffect, useCallback } from 'react';
import { fetchBusinessesInView, fetchEventsInView } from '@/services/api';
import { Building, CalendarDays, PartyPopper, Store, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '../ui/skeleton';

const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 }; // San Francisco
const DEFAULT_ZOOM = 12;

interface MapViewProps {
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
}

export function MapView({ initialCenter = DEFAULT_CENTER, initialZoom = DEFAULT_ZOOM }: MapViewProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [loading, setLoading] = useState(true);

  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;


  const loadMapData = useCallback(async (currentMap?: google.maps.Map) => {
    const mapToUse = currentMap || mapInstance;
    if (!mapToUse) return;

    setLoading(true);
    const bounds = mapToUse.getBounds();
    if (!bounds) {
      setLoading(false);
      return;
    }

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const queryBounds = {
      minLat: sw.lat(),
      maxLat: ne.lat(),
      minLng: sw.lng(),
      maxLng: ne.lng(),
    };

    try {
      const [bizRes, eventRes] = await Promise.all([
        fetchBusinessesInView(queryBounds),
        fetchEventsInView(queryBounds),
      ]);
      setBusinesses(bizRes);
      setEvents(eventRes);
    } catch (error) {
      console.error('Failed to load map data:', error);
    } finally {
      setLoading(false);
    }
  }, [mapInstance]);

  useEffect(() => {
    if (mapInstance) {
      loadMapData();
    }
  }, [mapInstance, loadMapData]);
  
  const handleMarkerClick = (item: MapItem) => {
    setSelectedItem(item);
    if (mapInstance) {
      mapInstance.panTo({ lat: item.location.coordinates[1], lng: item.location.coordinates[0] });
    }
  };

  const renderCalloutContent = () => {
    if (!selectedItem) return null;

    if (selectedItem.type === 'business') {
      const business = selectedItem as Business;
      return (
        <Card className="w-80 shadow-xl">
          <CardHeader className="p-4">
            {business.category.toLowerCase().includes('cafe') || business.category.toLowerCase().includes('restaurant') ? (
                <Image src={`https://picsum.photos/seed/${business._id}/320/160`} alt={business.name} width={320} height={160} className="rounded-t-md object-cover" data-ai-hint="cafe restaurant" />
            ) : (
                <Image src={`https://picsum.photos/seed/${business._id}/320/160`} alt={business.name} width={320} height={160} className="rounded-t-md object-cover" data-ai-hint="business storefront" />
            )}
            <CardTitle className="mt-2 text-xl">{business.name}</CardTitle>
            <CardDescription>{business.category}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground mb-2">{business.address}</p>
            {business.description && <p className="text-sm mb-2">{business.description}</p>}
            {business.currentPromotion && (
              <div className="mt-2 pt-2 border-t">
                <Badge variant="default" className="mb-1 bg-accent text-accent-foreground">{business.currentPromotion.title}</Badge>
                <p className="text-xs text-muted-foreground">{business.currentPromotion.details}</p>
                {business.currentPromotion.expiresAt && (
                  <p className="text-xs text-muted-foreground">Expires: {new Date(business.currentPromotion.expiresAt).toLocaleDateString()}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      );
    } else {
      const event = selectedItem as Event;
      return (
        <Card className="w-80 shadow-xl">
           <Image src={`https://picsum.photos/seed/${event._id}/320/160`} alt={event.title} width={320} height={160} className="rounded-t-md object-cover" data-ai-hint="event gathering" />
          <CardHeader className="p-4">
            <CardTitle className="text-xl">{event.title}</CardTitle>
             <Badge variant="secondary" className="w-fit my-1">{event.isPublic ? 'Public Event' : 'Private Event'}</Badge>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground mb-2">{new Date(event.startTime).toLocaleString()}</p>
            <p className="text-sm mb-2">{event.description}</p>
            <p className="text-sm font-semibold">Interested: {event.interestedCount}</p>
          </CardContent>
        </Card>
      );
    }
  };
  
  if (loading && (!businesses.length && !events.length)) {
    return (
      <div className="h-[600px] w-full relative">
        <Skeleton className="absolute inset-0 rounded-lg" />
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <p className="text-lg font-semibold">Loading Map Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] w-full relative rounded-lg overflow-hidden shadow-xl border">
      <Map
        defaultCenter={initialCenter}
        defaultZoom={initialZoom}
        mapId={mapId || 'DEMO_MAP_ID'} // Provide a fallback mapId or ensure NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID is set
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        onReady={(map) => setMapInstance(map)}
        onIdle={loadMapData}
        className="w-full h-full"
      >
        {businesses.map((biz) => (
          <AdvancedMarker
            key={`biz-${biz._id}`}
            position={{ lat: biz.location.coordinates[1], lng: biz.location.coordinates[0] }}
            onClick={() => handleMarkerClick({ ...biz, type: 'business' })}
          >
            <Pin background={'hsl(var(--primary))'} borderColor={'hsl(var(--primary-foreground))'} glyphColor={'hsl(var(--primary-foreground))'}>
              {biz.category.toLowerCase().includes('cafe') || biz.category.toLowerCase().includes('restaurant') ? <Store size={18} /> : <Building size={18} /> }
            </Pin>
          </AdvancedMarker>
        ))}

        {events.map((evt) => (
          <AdvancedMarker
            key={`evt-${evt._id}`}
            position={{ lat: evt.location.coordinates[1], lng: evt.location.coordinates[0] }}
            onClick={() => handleMarkerClick({ ...evt, type: 'event' })}
          >
             <Pin background={'hsl(var(--accent))'} borderColor={'hsl(var(--accent-foreground))'} glyphColor={'hsl(var(--accent-foreground))'}>
                {evt.title.toLowerCase().includes('music') || evt.title.toLowerCase().includes('party') ? <PartyPopper size={18}/> : <CalendarDays size={18}/>}
            </Pin>
          </AdvancedMarker>
        ))}

        {selectedItem && (
          <InfoWindow
            position={{ lat: selectedItem.location.coordinates[1], lng: selectedItem.location.coordinates[0] }}
            onCloseClick={() => setSelectedItem(null)}
            pixelOffset={new google.maps.Size(0, -40)} // Adjust based on Pin size
          >
            <div className="p-1 bg-transparent">
              {renderCalloutContent()}
            </div>
          </InfoWindow>
        )}
      </Map>
       {loading && (
        <div className="absolute top-4 right-4 bg-background/80 p-2 rounded-md shadow-md">
          <p className="text-sm text-foreground animate-pulse">Loading data...</p>
        </div>
      )}
    </div>
  );
}
