import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("animate-spin", sizeClasses[size])}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="grad-orange-spinner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(28 100% 50%)"></stop>
              <stop offset="100%" stopColor="hsl(28 100% 65%)"></stop>
            </linearGradient>
            <linearGradient id="grad-blue-spinner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(197 100% 36%)"></stop>
              <stop offset="100%" stopColor="hsl(197 100% 50%)"></stop>
            </linearGradient>
          </defs>
          <ellipse cx="65" cy="65" rx="40" ry="28" fill="url(#grad-orange-spinner)" transform="rotate(-25 65 65)"></ellipse>
          <ellipse cx="135" cy="65" rx="40" ry="28" fill="url(#grad-orange-spinner)" transform="rotate(25 135 65)"></ellipse>
          <ellipse cx="65" cy="135" rx="40" ry="28" fill="url(#grad-blue-spinner)" transform="rotate(25 65 135)"></ellipse>
          <ellipse cx="135" cy="135" rx="40" ry="28" fill="url(#grad-orange-spinner)" transform="rotate(-25 135 135)"></ellipse>
        </svg>
      </div>
    </div>
  );
}
