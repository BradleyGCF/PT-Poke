import Link from "next/link";
import { classNames } from "~/utils";

interface SignInButtonProps {
  variant?: "desktop" | "mobile";
  className?: string;
}

export function SignInButton({
  variant = "desktop",
  className,
}: SignInButtonProps) {
  const baseClasses =
    "rounded-md bg-red-400 text-white shadow-sm hover:bg-red-500";
  const variantClasses = {
    desktop:
      "ml-4 px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400",
    mobile: "block px-3 py-2 text-base font-medium",
  };

  return (
    <Link
      href="/api/auth/signin"
      className={classNames(
        baseClasses,
        variantClasses[variant],
        className ?? "",
      )}
    >
      Sign in
    </Link>
  );
}
