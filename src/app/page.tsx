
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapIcon, Search, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/map');
    }
  }, [user, loading, router]);

  if (loading || (!loading && user)) {
    // Show loading state or nothing if redirecting
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  // If not loading and no user, show landing page
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-2xl font-bold">
            <MapIcon className="h-8 w-8" />
            <span>Eventide</span>
          </div>
          <div className="space-x-2">
            <Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary to-blue-700 text-primary-foreground py-20 sm:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Discover What&apos;s Happening Around You
            </h1>
            <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
              Eventide connects you with local events, community gatherings, and exclusive promotions from businesses in your neighborhood.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Eventide?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <Search className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Explore Local Gems</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Find unique events and hidden promotions you wouldn&apos;t discover otherwise.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center text-center">
                   <div className="p-3 bg-primary/10 rounded-full mb-3">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Connect with Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Join local gatherings, support neighborhood businesses, and feel more connected.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center text-center">
                   <div className="p-3 bg-primary/10 rounded-full mb-3">
                     <Briefcase className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Boost Your Business</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Are you a business owner? Easily post promotions and events to reach local customers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Image Showcase section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
             <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Experience Eventide</h2>
            <div className="rounded-lg overflow-hidden shadow-2xl border-4 border-primary/20">
               <Image 
                src="https://picsum.photos/seed/eventideApp/1200/600" 
                alt="Eventide App Showcase" 
                width={1200} 
                height={600}
                className="w-full object-cover"
                data-ai-hint="app interface map" 
              />
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-foreground text-background py-8 text-center">
        <p>&copy; {new Date().getFullYear()} Eventide. Your local discovery platform.</p>
      </footer>
    </div>
  );
}
