"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { signUp, signInWithGoogle } from "@/lib/supabase/auth";
import { registerSchema } from "@/lib/validations/auth";

const formSchema = registerSchema
  .extend({
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const result = await signUp(
      values.email,
      values.password,
      values.full_name,
    );

    setIsLoading(false);

    if (result.success && result.data) {
      // Show success modal
      setRegisteredEmail(values.email);
      setShowSuccessModal(true);
    } else {
      // Show error toast with specific message
      const errorMessage = !result.success ? result.error : "Gagal mendaftar";
      toast.error(errorMessage, {
        description: getErrorDescription(errorMessage),
        duration: 5000,
      });
    }
  }

  // Helper to provide more context for common errors
  function getErrorDescription(error: string): string | undefined {
    if (error.toLowerCase().includes("rate limit")) {
      return "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.";
    }
    if (
      error.toLowerCase().includes("already registered") ||
      error.toLowerCase().includes("already exists")
    ) {
      return "Silakan login atau gunakan email lain.";
    }
    if (error.toLowerCase().includes("invalid email")) {
      return "Pastikan format email sudah benar.";
    }
    if (error.toLowerCase().includes("password")) {
      return "Password harus minimal 8 karakter.";
    }
    return undefined;
  }

  function handleGoToLogin() {
    setShowSuccessModal(false);
    router.push("/login");
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);

    const result = await signInWithGoogle();

    if (result.success && result.data) {
      window.location.href = result.data.url;
    } else {
      const errorMessage = !result.success
        ? result.error
        : "Gagal login dengan Google";
      toast.error(errorMessage);
      setIsGoogleLoading(false);
    }
  }

  return (
    <>
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Registrasi Berhasil! 🎉
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              <div className="space-y-3">
                <p>Akun Anda telah berhasil dibuat.</p>
                <div className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                  <Mail className="h-5 w-5 shrink-0" />
                  <span>
                    Cek email <strong>{registeredEmail}</strong> untuk
                    konfirmasi akun Anda.
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tidak menerima email? Cek folder spam atau tunggu beberapa
                  menit.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button onClick={handleGoToLogin} className="w-full">
              Lanjut ke Login
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSuccessModal(false)}
              className="w-full"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Form */}
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Buat Akun Baru
            </CardTitle>
            <CardDescription>
              Masukkan data Anda untuk membuat akun
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Lanjutkan dengan Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Atau daftar dengan email
                </span>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="nama@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Minimal 8 karakter"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Ulangi password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Daftar Sekarang
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <div>
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-primary underline-offset-4 hover:underline font-medium"
              >
                Masuk di sini
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
