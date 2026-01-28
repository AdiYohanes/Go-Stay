import { toast } from "sonner";
import { AppError } from "./errors";

export function showError(error: unknown) {
  if (error instanceof AppError) {
    toast.error(error.message);
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error("An unexpected error occurred");
  }
}

export function showSuccess(message: string) {
  toast.success(message);
}

export function showLoading(message: string) {
  return toast.loading(message);
}

export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

// CRUD operation toasts
export function showCreateSuccess(entity: string) {
  toast.success(`${entity} created successfully`);
}

export function showUpdateSuccess(entity: string) {
  toast.success(`${entity} updated successfully`);
}

export function showDeleteSuccess(entity: string) {
  toast.success(`${entity} deleted successfully`);
}

// Booking-specific toasts
export function showBookingConfirmed() {
  toast.success("Booking confirmed!", {
    description: "You will receive a confirmation email shortly.",
  });
}

export function showBookingCancelled() {
  toast.success("Booking cancelled", {
    description: "Your booking has been cancelled successfully.",
  });
}

export function showBookingError(message?: string) {
  toast.error(message || "Failed to process booking", {
    description: "Please try again or contact support.",
  });
}

// Payment-specific toasts
export function showPaymentProcessing() {
  return toast.loading("Processing payment...", {
    description: "Please wait while we process your payment.",
  });
}

export function showPaymentSuccess() {
  toast.success("Payment successful!", {
    description: "Your booking has been confirmed.",
    duration: 5000,
  });
}

export function showPaymentFailed(message?: string) {
  toast.error(message || "Payment failed", {
    description: "Please try again or use a different payment method.",
    duration: 5000,
  });
}

export function showPaymentPending() {
  toast.warning("Payment pending", {
    description: "We're waiting for payment confirmation.",
    duration: 5000,
  });
}

// Cart-specific toasts
export function showAddedToCart(propertyName: string) {
  toast.success("Added to cart", {
    description: `${propertyName} has been added to your cart.`,
  });
}

export function showRemovedFromCart() {
  toast.success("Removed from cart");
}

export function showCartCleared() {
  toast.success("Cart cleared");
}

// Favorites-specific toasts
export function showAddedToFavorites() {
  toast.success("Added to favorites");
}

export function showRemovedFromFavorites() {
  toast.success("Removed from favorites");
}

// Review-specific toasts
export function showReviewSubmitted() {
  toast.success("Review submitted", {
    description: "Thank you for your feedback!",
  });
}

export function showReviewUpdated() {
  toast.success("Review updated");
}

export function showReviewDeleted() {
  toast.success("Review deleted");
}

// Auth-specific toasts
export function showLoginSuccess() {
  toast.success("Welcome back!");
}

export function showLogoutSuccess() {
  toast.success("Logged out successfully");
}

export function showRegistrationSuccess() {
  toast.success("Account created!", {
    description: "Welcome to our platform!",
  });
}

// Validation toasts
export function showValidationError(message: string) {
  toast.error("Validation error", {
    description: message,
  });
}

// Generic info toast
export function showInfo(message: string, description?: string) {
  toast.info(message, {
    description,
  });
}

// Generic warning toast
export function showWarning(message: string, description?: string) {
  toast.warning(message, {
    description,
  });
}

// Promise-based toast for async operations
export function showPromiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
}

