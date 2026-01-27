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
