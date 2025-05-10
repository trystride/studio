
"use client";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit3 } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading profile...</p>; // Or redirect if AuthGuard didn't catch
  }
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">My Profile</CardTitle>
          <CardDescription>View and manage your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} alt={user.name || user.email} data-ai-hint="profile avatar" />
              <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold">{user.name || "Anonymous User"}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge variant={user.role === 'business_owner' ? 'default' : 'secondary'} className="mt-2">
                {user.role === 'business_owner' ? 'Business Owner' : 'User'}
              </Badge>
            </div>
            <Button variant="outline" size="icon" className="ml-auto hidden md:flex">
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Edit Profile</span>
            </Button>
          </div>

          <Separator />

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name || ""} placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user.email} placeholder="your@email.com" readOnly disabled />
                 <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" placeholder="Enter current password to change" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" className="md:hidden">
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                 <Button type="submit">Save Changes</Button>
            </div>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}

// A simple Badge component, if not using shadcn's or for customization
function Badge({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: string }) {
  const baseStyle = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none";
  const variantStyle = variant === 'default' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground";
  return (
    <span className={`${baseStyle} ${variantStyle} ${className}`}>
      {children}
    </span>
  );
}
