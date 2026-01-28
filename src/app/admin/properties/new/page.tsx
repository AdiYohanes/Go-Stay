/**
 * Admin New Property Page
 * Requirements: 1.1, 1.3
 */

"use client";

import { useRouter } from "next/navigation";
import { PropertyForm } from "@/components/property/PropertyForm";
import { Property } from "@/types/property.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewPropertyPage() {
  const router = useRouter();

  function handleSuccess(property: Property) {
    toast.success("Property created successfully");
    router.push("/admin/properties");
  }

  function handleCancel() {
    router.push("/admin/properties");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/properties">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
        <p className="text-muted-foreground mt-2">
          Create a new property listing for the platform
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  );
}
