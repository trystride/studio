
import { MapView } from '@/components/map/MapView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MapPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">Explore Local Events & Businesses</CardTitle>
          <CardDescription>
            Discover what&apos;s happening around you. Click on markers for details. The map updates as you pan and zoom.
          </CardDescription>
        </CardHeader>
      </Card>
      <MapView />
    </div>
  );
}
