import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { classNames } from "~/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

const buttonVariants = {
  primary:
    "bg-red-400 hover:bg-red-500 text-white focus-visible:outline-red-400",
  secondary: "bg-white hover:bg-gray-50 text-gray-900 ring-1 ring-gray-300",
};

export function Button({
  children,
  className,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        "rounded-lg px-6 py-3 text-sm font-semibold shadow-sm transition-all duration-200 ease-in-out hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none",
        buttonVariants[variant],
        disabled ? "cursor-not-allowed opacity-50" : "",
        className ?? "",
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
