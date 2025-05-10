
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { createNewBusiness, updatePromotion } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const businessFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  address: z.string().min(5, "Address is too short.").max(200),
  category: z.string().min(2, "Category is required.").max(50),
  description: z.string().max(500).optional(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

const promotionFormSchema = z.object({
  title: z.string().min(3, "Promotion title is too short.").max(100),
  details: z.string().min(10, "Promotion details are too short.").max(500),
  expiresAt: z.date().optional(),
});

// This component will manage a business. For simplicity, we'll assume one business per owner for now.
// A real app would fetch existing business data if any.
// For this mock, we'll always "create" or "update" a hardcoded mock business ID.
const MOCK_BUSINESS_ID_FOR_PROMOTION = "biz1"; 

export function CreateBusinessForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const businessForm = useForm<z.infer<typeof businessFormSchema>>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: "",
      address: "",
      category: "",
      description: "",
      latitude: 37.7749,
      longitude: -122.4194,
    },
  });

  const promotionForm = useForm<z.infer<typeof promotionFormSchema>>({
    resolver: zodResolver(promotionFormSchema),
    defaultValues: {
      title: "",
      details: "",
    },
  });

  async function onBusinessSubmit(values: z.infer<typeof businessFormSchema>) {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    if (user.role !== 'business_owner') {
      toast({ title: "Permission Denied", description: "Only business owners can manage businesses.", variant: "destructive" });
      return;
    }

    try {
      const businessData = {
        ...values,
        location: { type: 'Point' as const, coordinates: [values.longitude, values.latitude] as [number, number] },
        owner: user.id,
      };
      const { latitude, longitude, ...finalBusinessData } = businessData;

      // In a real app, this would be createOrUpdate. For mock:
      await createNewBusiness(finalBusinessData as any); 
      toast({
        title: "Business Details Saved!",
        description: `Your business "${values.name}" has been updated.`,
      });
      // Potentially refresh data or navigate
    } catch (error) {
      toast({
        title: "Error Saving Business",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function onPromotionSubmit(values: z.infer<typeof promotionFormSchema>) {
     if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
     if (user.role !== 'business_owner') {
      toast({ title: "Permission Denied", description: "Only business owners can manage promotions.", variant: "destructive" });
      return;
    }

    try {
      const promotionData = {
        ...values,
        expiresAt: values.expiresAt?.toISOString(),
      };
      await updatePromotion(MOCK_BUSINESS_ID_FOR_PROMOTION, promotionData);
      toast({
        title: "Promotion Updated!",
        description: "Your current promotion has been saved.",
      });
      promotionForm.reset();
    } catch (error) {
       toast({
        title: "Error Updating Promotion",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Manage Your Business</CardTitle>
        <CardDescription>Update your business details and current promotions on Eventide.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="business_details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="business_details">Business Details</TabsTrigger>
            <TabsTrigger value="promotion">Current Promotion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="business_details">
            <Form {...businessForm}>
              <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-8 mt-6">
                <FormField control={businessForm.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl><Input placeholder="e.g., My Awesome Shop" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={businessForm.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input placeholder="123 Main St, Anytown" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={businessForm.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl><Input placeholder="e.g., Retail, Restaurant, Service" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={businessForm.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="A brief description of your business." {...field} className="min-h-[100px]" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={businessForm.control} name="latitude" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl><Input type="number" step="any" placeholder="e.g., 37.7749" {...field} /></FormControl>
                        <FormDescription>Find on Google Maps.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  <FormField control={businessForm.control} name="longitude" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl><Input type="number" step="any" placeholder="e.g., -122.4194" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                </div>
                <Button type="submit" className="w-full md:w-auto" disabled={businessForm.formState.isSubmitting}>
                  {businessForm.formState.isSubmitting ? "Saving..." : "Save Business Details"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="promotion">
            <Form {...promotionForm}>
              <form onSubmit={promotionForm.handleSubmit(onPromotionSubmit)} className="space-y-8 mt-6">
                <FormField control={promotionForm.control} name="title" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Title</FormLabel>
                    <FormControl><Input placeholder="e.g., 20% Off All Items" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={promotionForm.control} name="details" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Details</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Valid until end of month. Excludes sale items." {...field} className="min-h-[100px]" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={promotionForm.control} name="expiresAt" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expires At (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full md:w-auto" disabled={promotionForm.formState.isSubmitting}>
                  {promotionForm.formState.isSubmitting ? "Updating..." : "Update Promotion"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
