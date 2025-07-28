import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { classNames } from "~/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const buttonVariants = {
  primary:
    "bg-red-400 hover:bg-red-500 text-white focus-visible:outline-red-400",
  secondary: "bg-white hover:bg-gray-50 text-gray-900 ring-1 ring-gray-300",
  danger:
    "bg-red-600 hover:bg-red-700 text-white focus-visible:outline-red-600",
};

const buttonSizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        "rounded-lg font-semibold shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none",
        buttonVariants[variant],
        buttonSizes[size],
        (disabled ?? isLoading) ? "cursor-not-allowed opacity-50" : "",
        className ?? "",
      )}
      disabled={disabled ?? isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}
