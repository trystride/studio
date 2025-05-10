
import { AuthGuard } from '@/components/common/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { APIProvider } from '@vis.gl/react-google-maps';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure GOOGLE_MAPS_API_KEY is available for APIProvider
  // This key should be stored in .env.local (e.g., NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    // This is a server component, so console.error will appear in server logs
    console.error("Google Maps API Key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file.");
    // You might want to render a message to the user in a client component if the key is missing during runtime
  }
  
  return (
    <AuthGuard>
      <APIProvider apiKey={googleMapsApiKey || ""}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
           <footer className="py-6 text-center text-sm text-muted-foreground border-t">
            © {new Date().getFullYear()} Eventide. All rights reserved.
          </footer>
        </div>
      </APIProvider>
    </AuthGuard>
  );
}
