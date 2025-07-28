import { type ReactNode } from "react";
import { classNames } from "~/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={classNames(
        "overflow-hidden rounded-xl border border-gray-200/50 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out",
        hover ? "hover:-translate-y-1 hover:bg-white/90 hover:shadow-lg" : "",
        className ?? "",
      )}
    >
      {children}
    </div>
  );
}
