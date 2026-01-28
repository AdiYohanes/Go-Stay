"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, PropertyFormData } from "@/lib/validations/property";
import { Property } from "@/types/property.types";
import { createProperty, updateProperty } from "@/actions/properties";
import { uploadPropertyImages, deletePropertyImage } from "@/actions/storage";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { X, Upload, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PropertyForm component for admin property management
 * Requirements: 1.1, 1.2, 1.5, 1.7
 *
 * Features:
 * - Form fields for all property data
 * - Image upload with drag-and-drop
 * - Amenity selection with predefined list + custom
 * - Form validation with error display
 */

interface PropertyFormProps {
  property?: Property;
  onSuccess?: (property: Property) => void;
  onCancel?: () => void;
}

// Predefined amenities list
const PREDEFINED_AMENITIES = [
  "WiFi",
  "Kitchen",
  "Washer",
  "Dryer",
  "Air conditioning",
  "Heating",
  "TV",
  "Pool",
  "Hot tub",
  "Free parking",
  "Gym",
  "Workspace",
  "Breakfast",
  "Pets allowed",
  "Smoking allowed",
];

export function PropertyForm({
  property,
  onSuccess,
  onCancel,
}: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    property?.image_urls || [],
  );
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    property?.amenities || [],
  );
  const [customAmenity, setCustomAmenity] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title || "",
      description: property?.description || "",
      price_per_night: property?.price_per_night || 0,
      location: property?.location || "",
      max_guests: property?.max_guests || 1,
      bedrooms: property?.bedrooms || 1,
      beds: property?.beds || 1,
      bathrooms: property?.bathrooms || 1,
      amenities: property?.amenities || [],
    },
  });

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Generate temporary property ID for new properties
    const propertyId = property?.id || `temp-${Date.now()}`;

    setIsUploadingImages(true);

    try {
      const fileArray = Array.from(files);
      const result = await uploadPropertyImages(propertyId, fileArray);

      if (result.success) {
        setUploadedImages((prev) => [...prev, ...result.data]);
        toast.success(`${result.data.length} image(s) uploaded successfully`);
      } else {
        toast.error(result.error || "Failed to upload images");
      }
    } catch {
      toast.error("An unexpected error occurred during upload");
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      const result = await deletePropertyImage(imageUrl);

      if (result.success) {
        setUploadedImages((prev) => prev.filter((url) => url !== imageUrl));
        toast.success("Image removed");
      } else {
        toast.error(result.error || "Failed to remove image");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !selectedAmenities.includes(trimmed)) {
      setSelectedAmenities((prev) => [...prev, trimmed]);
      setCustomAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);

    try {
      const propertyData = {
        ...data,
        amenities: selectedAmenities,
        image_urls: uploadedImages,
      };

      let result;
      if (property) {
        // Update existing property
        result = await updateProperty(property.id, propertyData);
      } else {
        // Create new property
        result = await createProperty(propertyData);
      }

      if (result.success) {
        toast.success(
          property
            ? "Property updated successfully"
            : "Property created successfully",
        );
        onSuccess?.(result.data);
      } else {
        toast.error(result.error || "Failed to save property");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Beautiful beachfront villa" {...field} />
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
                    placeholder="Describe your property..."
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of your property
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input placeholder="Bali, Indonesia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pricing</h3>

          <FormField
            control={form.control}
            name="price_per_night"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Night (USD) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Property Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Property Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="max_guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Guests *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="4"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="2"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="beds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beds</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="3"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="2"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Images</h3>

          {/* Image Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
            )}
          >
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
              disabled={isUploadingImages}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {isUploadingImages ? (
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-10 w-10 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">
                  {isUploadingImages
                    ? "Uploading..."
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-muted-foreground">
                  JPEG, PNG, or WebP (max 5MB per file)
                </p>
              </div>
            </label>
          </div>

          {/* Uploaded Images Grid */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedImages.map((imageUrl, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={imageUrl}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(imageUrl)}
                    className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Amenities</h3>

          {/* Predefined Amenities */}
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_AMENITIES.map((amenity) => (
              <Badge
                key={amenity}
                variant={
                  selectedAmenities.includes(amenity) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => toggleAmenity(amenity)}
              >
                {amenity}
              </Badge>
            ))}
          </div>

          {/* Custom Amenity Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom amenity"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomAmenity();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addCustomAmenity}
              disabled={!customAmenity.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Custom Amenities */}
          {selectedAmenities.filter((a) => !PREDEFINED_AMENITIES.includes(a))
            .length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Custom Amenities:</p>
              <div className="flex flex-wrap gap-2">
                {selectedAmenities
                  .filter((a) => !PREDEFINED_AMENITIES.includes(a))
                  .map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="gap-1">
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {property ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{property ? "Update Property" : "Create Property"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
