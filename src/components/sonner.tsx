"use client";
import { cn } from "@/utils/helper";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast as toastSonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

interface ToastProps {
  message: string;
  variant: "success" | "error" | "info" | "warning";
}

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-primary-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "bg-white text-black",
        },
      }}
      {...props}
    />
  );
};

export const toast = ({ message, variant }: ToastProps) => {
  return toastSonner[variant](message, {
    className: cn({
      "!bg-green-500": variant === "success",
      "!bg-red-500": variant === "error",
    }),
    closeButton: true,
  });
};

export const successToast = (message: string) => {
  return toast({ message, variant: "success" });
};

export const errorToast = (message: string) => {
  return toast({ message, variant: "error" });
};
