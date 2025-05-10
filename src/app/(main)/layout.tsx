
import { AuthGuard } from '@/components/common/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { MapProvider } from '@/components/layout/MapProvider'; // Import the new client component

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <MapProvider> {/* Use the client component to wrap children */}
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
           <footer className="py-6 text-center text-sm text-muted-foreground border-t">
            © {new Date().getFullYear()} Eventide. All rights reserved.
          </footer>
        </div>
      </MapProvider>
    </AuthGuard>
  );
}

