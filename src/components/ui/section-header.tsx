import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function SectionHeader({ 
  title, 
  subtitle, 
  size = 'md', 
  className,
  children 
}: SectionHeaderProps) {
  const sizes = {
    sm: {
      title: 'text-lg sm:text-xl font-bold',
      subtitle: 'text-sm text-muted-foreground',
      spacing: 'mb-4'
    },
    md: {
      title: 'text-xl sm:text-2xl lg:text-3xl font-black',
      subtitle: 'text-base sm:text-lg text-muted-foreground font-medium',
      spacing: 'mb-6 lg:mb-8'
    },
    lg: {
      title: 'text-2xl sm:text-3xl lg:text-4xl font-black',
      subtitle: 'text-lg sm:text-xl text-muted-foreground font-medium',
      spacing: 'mb-8 lg:mb-12'
    }
  };

  const sizeClasses = sizes[size];

  return (
    <div className={cn("text-center", sizeClasses.spacing, className)}>
      <h2 className={cn(
        sizeClasses.title,
        "text-green-100 drop-shadow-xl tracking-tight mb-3"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn(sizeClasses.subtitle, "text-green-200 mb-4")}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
} 