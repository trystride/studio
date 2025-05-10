
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { createNewEvent } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  startTime: z.date({ required_error: "Start date and time are required." }),
  endTime: z.date().optional(),
  isPublic: z.boolean().default(true),
}).refine(data => !data.endTime || data.endTime > data.startTime, {
  message: "End time must be after start time.",
  path: ["endTime"],
});

export function CreateEventForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      latitude: 37.7749, // Default to SF
      longitude: -122.4194,
      isPublic: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to create an event.", variant: "destructive" });
      return;
    }
    try {
      const eventData = {
        ...values,
        startTime: values.startTime.toISOString(),
        endTime: values.endTime?.toISOString(),
        location: { type: 'Point' as const, coordinates: [values.longitude, values.latitude] as [number, number] },
        creator: user.id,
      };
      // Remove lat/lng as they are now in location object
      // This typing is a bit manual for the mock API, a real API would handle its own DTO
      const { latitude, longitude, ...finalEventData } = eventData;


      await createNewEvent(finalEventData as any); // Cast as any to satisfy mock API for now
      toast({
        title: "Event Created!",
        description: `Your event "${values.title}" has been successfully created.`,
      });
      form.reset();
      router.push('/map'); // Or to event details page
    } catch (error) {
      toast({
        title: "Error Creating Event",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create a New Event</CardTitle>
        <CardDescription>Fill in the details below to add your event to Eventide.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer Music Festival" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us more about your event..." {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="e.g., 37.7749" {...field} />
                    </FormControl>
                    <FormDescription>Tip: Use Google Maps to find coordinates.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" placeholder="e.g., -122.4194" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => field.onChange(date ? new Date(date.setHours(field.value?.getHours() || 0, field.value?.getMinutes() || 0)) : undefined)}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <FormLabel className="text-sm">Time</FormLabel>
                          <Input type="time" 
                           defaultValue={field.value ? format(field.value, "HH:mm") : "00:00"}
                           onChange={(e) => {
                             const [hours, minutes] = e.target.value.split(':').map(Number);
                             const currentDate = field.value || new Date();
                             field.onChange(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes));
                           }}
                           />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date & Time (Optional)</FormLabel>
                     <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP HH:mm")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                           onSelect={(date) => field.onChange(date ? new Date(date.setHours(field.value?.getHours() || 0, field.value?.getMinutes() || 0)) : undefined)}
                        />
                         <div className="p-3 border-t border-border">
                          <FormLabel className="text-sm">Time</FormLabel>
                          <Input type="time" 
                           defaultValue={field.value ? format(field.value, "HH:mm") : "00:00"}
                           onChange={(e) => {
                             const [hours, minutes] = e.target.value.split(':').map(Number);
                             const currentDate = field.value || new Date();
                             field.onChange(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes));
                           }}
                           />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* isPublic can be a checkbox if needed later */}
            <Button type="submit" className="w-full md:w-auto" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating Event..." : "Create Event"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
