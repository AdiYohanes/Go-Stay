"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createProperty } from "@/actions/properties";

const formSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  price: z.coerce.number().min(1), // coerce handles string input to number
  location: z.string().min(3),
  guests: z.coerce.number().min(1),
  amenities: z.string().min(3), // simplified for now, comma separated
});

export default function NewPropertyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "",
      guests: 1,
      amenities: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const result = await createProperty({
      title: values.title,
      description: values.description,
      price_per_night: values.price,
      location: values.location,
      max_guests: values.guests,
      amenities: values.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    });

    setIsLoading(false);
    if (!result.success) {
      toast.error(result.error);
    } else {
      toast.success("Property created successfully");
      router.push("/admin/properties");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
        <p className="text-muted-foreground">
          Fill in the details below to list a new property.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Modern City Apartment"
                    {...field}
                    value={field.value as string}
                  />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the property..."
                    className="min-h-[100px]"
                    {...field}
                    value={field.value as string}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Night ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value as number}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Guests</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value as number}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="New York, NY"
                    {...field}
                    value={field.value as string}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Wifi, Kitchen, Parking (comma separated)"
                    {...field}
                    value={field.value as string}
                  />
                </FormControl>
                <FormDescription>
                  Separate multiple amenities with commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Property
          </Button>
        </form>
      </Form>
    </div>
  );
}
