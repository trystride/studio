"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapIcon, Search, Users, Briefcase, Star, Sparkles, ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Placeholder for a high-quality hero background image or video
const HERO_BACKGROUND_IMAGE_URL = "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"; // Replace with a vibrant local event/community image
// Placeholder for an actual app screenshot/mockup
const APP_MOCKUP_IMAGE_URL = "/images/eventide-app-mockup.png"; // **CREATE THIS!** A polished screenshot of your map interface.
const APP_MOCKUP_MOBILE_IMAGE_URL = "/images/eventide-app-mockup-mobile.png"; // **CREATE THIS!** Mobile version.

const FeatureCard = ({ icon: Icon, title, children, delay }: { icon: React.ElementType, title: string, children: React.ReactNode, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
  >
    <Card className="h-full transform shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader className="items-center text-center pb-4">
        <motion.div
          className="p-4 bg-primary/10 rounded-full mb-4 inline-block"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Icon className="h-10 w-10 text-primary" />
        </motion.div>
        <CardTitle className="text-xl font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center text-sm leading-relaxed">
          {children}
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/map');
    }
  }, [user, loading, router]);

  if (loading || (!loading && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary"></div>
        <p className="sr-only">Loading Eventide...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            <MapIcon className="h-8 w-8" />
            <span>Eventide</span>
          </Link>
          <nav className="space-x-2 sm:space-x-3">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <Link href="/signup">Sign Up Free</Link>
            </Button>
          </nav>
        </div>
      </motion.header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative text-white pt-28 pb-32 sm:pt-36 sm:pb-40 overflow-hidden">
          {/* Background Image/Video - REPLACE with high quality */}
          <div className="absolute inset-0 z-0">
            <Image
              src={HERO_BACKGROUND_IMAGE_URL}
              alt="Vibrant local community event"
              fill
              style={{ objectFit: 'cover' }}
              priority
              className="opacity-60" // Darken or add overlay for text contrast
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 !leading-tight
                             bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-white to-gray-300">
                Rediscover Your City.
                <br />
                <span className="text-accent">Live. Local. Now.</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-300 mb-10 max-w-3xl mx-auto"
            >
              Eventide is your interactive map to the pulse of your neighborhood. Unearth hidden gems, join vibrant events, and connect with your community like never before.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 150 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-10 py-7 shadow-lg transform hover:scale-105 transition-transform" asChild>
                <Link href="/signup">
                  Explore Events Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10 hover:text-white text-lg px-10 py-7 shadow-lg transform hover:scale-105 transition-transform" asChild>
                <Link href="#how-it-works">
                  <PlayCircle className="mr-2 h-5 w-5" /> How It Works
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* "How It Works" or "What is Eventide?" Section (Added) */}
        <section id="how-it-works" className="py-16 sm:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Discover. Connect. Thrive.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Eventide makes local discovery effortless and engaging.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { icon: Search, title: "Pinpoint Your Passion", desc: "Instantly find events, deals, and places tailored to your interests on our dynamic map." },
                { icon: Users, title: "Forge Real Connections", desc: "Join local groups, meet like-minded people, and become an active part of your community." },
                { icon: Briefcase, title: "Empower Local Growth", desc: "Businesses, showcase your offerings and connect directly with an engaged local audience." }
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center"
                >
                  <div className="p-5 bg-primary/10 rounded-full mb-5 inline-block">
                    <item.icon className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section (Refined) */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Unlock Your Neighborhood's Potential</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Eventide is more than just a map; it's your key to a vibrant local life.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <FeatureCard icon={MapIcon} title="Intuitive Map Discovery" delay={0}>
                Experience a fluid, Snapchat-inspired map interface. Finding what's next is fun and visually engaging.
              </FeatureCard>
              <FeatureCard icon={Sparkles} title="Hyperlocal Promotions" delay={0.1}>
                Businesses showcase real-time deals. Users grab exclusive offers. A win-win for the local economy.
              </FeatureCard>
              <FeatureCard icon={Users} title="Community-Powered Events" delay={0.2}>
                From park yoga to pop-up markets, anyone can host and discover events, fostering true local spirit.
              </FeatureCard>
              <FeatureCard icon={Briefcase} title="Amplify Your Business" delay={0.3}>
                Gain visibility, attract new customers, and announce updates directly to an eager local audience.
              </FeatureCard>
              <FeatureCard icon={Search} title="Smart Search & Filters" delay={0.4}>
                Quickly find exactly what you're looking for, from "sushi deals" to "live music tonight."
              </FeatureCard>
               <FeatureCard icon={PlayCircle} title="Influencer Ready (Soon!)" delay={0.5}>
                Future-proofed for seamless brand-influencer collaborations with built-in content tools.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* Image Showcase Section (Crucial - Needs REAL Mockup) */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">See Eventide in Action</h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                    Visualize the vibrant, interactive experience awaiting you.
                </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border-4 border-primary/30"
            >
              {/* **REPLACE THIS IMAGE WITH YOUR ACTUAL APP MOCKUP** */}
              <Image
                src={APP_MOCKUP_IMAGE_URL} // Replace with your stunning app mockup
                alt="Eventide App Interface Showcase - Map view with event pins"
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 hover:scale-105"
                data-ai-hint="A clean, vibrant app interface showing a map with various event and business icons. Should look like Snapchat Maps but with Eventide's branding. Popups showing event details would be great."
              />
               <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors duration-300"></div>
            </motion.div>
            {/* Optional: Add smaller mobile mockup beside or below */}
            {/* <motion.div className="mt-8 max-w-xs mx-auto ...">
                <Image src={APP_MOCKUP_MOBILE_IMAGE_URL} ... />
            </motion.div> */}
          </div>
        </section>

        {/* Testimonials Section (Added) */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Loved by Locals & Businesses</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Hear what our early adopters are saying.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Sarah L.", role: "Local Explorer", quote: "Eventide completely changed how I find things to do! The map is so fun and I've discovered so many cool spots.", avatar: `https://i.pravatar.cc/150?u=sarah` },
                { name: "Mike R.", role: "Cafe Owner", quote: "Posting our daily specials on Eventide brought in a wave of new customers. It's simple and effective.", avatar: `https://i.pravatar.cc/150?u=mike` },
                { name: "Jess P.", role: "Community Organizer", quote: "Organizing our park clean-up was a breeze with Eventide. We got way more volunteers than expected!", avatar: `https://i.pravatar.cc/150?u=jess` },
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full bg-card/70 backdrop-blur-sm border-border/50 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="rounded-full mr-4" />
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <blockquote className="text-muted-foreground italic border-l-4 border-primary pl-4">
                        "{testimonial.quote}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 sm:py-28 bg-gradient-to-tr from-primary via-primary/90 to-blue-700 text-primary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h2
                    initial={{ opacity:0, y:20 }}
                    whileInView={{ opacity:1, y:0 }}
                    transition={{ duration:0.5 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl font-bold mb-6"
                >
                    Ready to Dive In?
                </motion.h2>
                <motion.p
                    initial={{ opacity:0, y:20 }}
                    whileInView={{ opacity:1, y:0 }}
                    transition={{ duration:0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto text-primary-foreground/90"
                >
                    Join thousands of others discovering the best of their city. Sign up for Eventide today and never miss out again.
                </motion.p>
                <motion.div
                    initial={{ opacity:0, scale:0.9 }}
                    whileInView={{ opacity:1, scale:1 }}
                    transition={{ duration:0.5, delay:0.2, type:"spring", stiffness:120 }}
                    viewport={{ once: true }}
                >
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-12 py-7 shadow-xl transform hover:scale-105 transition-transform" asChild>
                        <Link href="/signup">
                            Get Started - It's Free!
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>

      </main>

      <footer className="bg-foreground text-background/80 py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4 text-lg font-semibold text-background">
            <MapIcon className="h-6 w-6" />
            <span>Eventide</span>
          </div>
          <p className="text-sm mb-4">Your city, at your fingertips.</p>
          <div className="flex justify-center space-x-4 mb-6">
            {/* Replace with actual links */}
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
          <p className="text-xs text-background/60">© {new Date().getFullYear()} Eventide Technologies Inc. All rights reserved. Crafted with ❤️ in YourCity.</p>
        </div>
      </footer>
    </div>
  );
}