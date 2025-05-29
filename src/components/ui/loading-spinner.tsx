import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-2 border-green-200 border-t-green-600",
          sizes[size]
        )}
        role="status"
        aria-label={text || "در حال بارگذاری"}
      />
      {text && (
        <span className="text-sm text-green-200 font-medium">
          {text}
        </span>
      )}
    </div>
  );
} 