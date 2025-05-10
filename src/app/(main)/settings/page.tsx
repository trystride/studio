
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bell, Palette, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  // Mock settings state, in a real app this would come from user preferences / backend
  // For UI demonstration purposes only
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false); // This would need theme context integration

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">Settings</CardTitle>
          <CardDescription>Manage your application preferences and account settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Notifications Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center"><Bell className="mr-2 h-5 w-5 text-primary"/>Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates and news via email.</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  aria-label="Toggle email notifications"
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                   <p className="text-sm text-muted-foreground">Get real-time alerts on your device (coming soon).</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  disabled // Feature not implemented
                  aria-label="Toggle push notifications"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Appearance Section */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center"><Palette className="mr-2 h-5 w-5 text-primary"/>Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                 <div>
                  <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable a darker theme for the application.</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={(checked) => {
                     setDarkMode(checked);
                     // In a real app, this would call a function to toggle the theme class on <html>
                     if (checked) {
                        document.documentElement.classList.add('dark');
                     } else {
                        document.documentElement.classList.remove('dark');
                     }
                  }}
                  aria-label="Toggle dark mode"
                />
              </div>
            </div>
          </div>
          
          <Separator />

          {/* Account Section */}
           <div>
            <h3 className="text-lg font-medium mb-4 flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary"/>Account</h3>
            <div className="space-y-4">
               <div className="p-4 border rounded-lg">
                  <Label className="font-medium">Manage Account</Label>
                  <p className="text-sm text-muted-foreground mb-3">Update your profile information or change your password.</p>
                  <Button variant="outline" onClick={() => {/* router.push('/profile') */ alert("Navigate to Profile Page")}}>Go to Profile</Button>
              </div>
              <div className="p-4 border rounded-lg border-destructive/50">
                  <Label className="font-medium text-destructive">Delete Account</Label>
                  <p className="text-sm text-muted-foreground mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <Button variant="destructive" onClick={() => alert("Initiate Account Deletion Flow")}>Delete My Account</Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button onClick={() => alert("Settings Saved (mock)")}>Save Preferences</Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

// React import, might be needed if not automatically inferred by Next.js version
import React from 'react';
