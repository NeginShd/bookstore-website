import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  retryCount?: number;
  maxRetries?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ErrorMessage({
  title = "خطا در بارگذاری",
  message,
  onRetry,
  retryText = "تلاش مجدد", 
  retryCount = 0,
  maxRetries = 3,
  className,
  size = 'md'
}: ErrorMessageProps) {
  const sizes = {
    sm: {
      container: 'p-4',
      icon: 'h-4 w-4',
      title: 'text-base',
      message: 'text-sm',
      button: 'text-xs'
    },
    md: {
      container: 'p-6',
      icon: 'h-5 w-5', 
      title: 'text-lg',
      message: 'text-sm',
      button: 'text-sm'
    },
    lg: {
      container: 'p-8',
      icon: 'h-6 w-6',
      title: 'text-xl',
      message: 'text-base',
      button: 'text-base'
    }
  };

  const sizeClasses = sizes[size];
  const canRetry = onRetry && retryCount < maxRetries;

  return (
    <div 
      className={cn(
        "bg-red-900/20 border border-red-700/50 rounded-xl text-center transition-all duration-200 hover:bg-red-900/30",
        sizeClasses.container,
        className
      )}
      role="alert"
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <AlertCircle className={cn("text-red-400", sizeClasses.icon)} />
        <h3 className={cn("font-bold text-red-400", sizeClasses.title)}>
          {title}
        </h3>
      </div>
      
      <p className={cn("text-red-300 mb-4", sizeClasses.message)}>
        {message}
      </p>
      
      {canRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className={cn(
            "border-red-600 text-red-400 hover:bg-red-900/40 hover:text-red-300",
            sizeClasses.button
          )}
        >
          {retryText}
          <RefreshCw className="mr-1 h-4 w-4" />
        </Button>
      )}
      
      {retryCount >= maxRetries && (
        <p className="text-xs text-red-400/70 mt-2">
          حداکثر تعداد تلاش انجام شد
        </p>
      )}
      
      {retryCount > 0 && retryCount < maxRetries && (
        <p className="text-xs text-red-400/70 mt-2">
          تلاش {retryCount} از {maxRetries}
        </p>
      )}
    </div>
  );
} 