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
        "bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 overflow-hidden transition-all duration-300 ease-in-out",
        hover ? "hover:shadow-lg hover:bg-white/90 hover:-translate-y-1" : "",
        className || ""
      )}
    >
      {children}
    </div>
  );
} 