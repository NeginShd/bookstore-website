import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: string;
  count?: number;
  variant?: 'default' | 'popular' | 'award' | 'special';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CategoryBadge({ 
  category, 
  count, 
  variant = 'default', 
  size = 'md',
  className 
}: CategoryBadgeProps) {
  const variants = {
    default: 'bg-green-800/30 text-green-300/70 border-green-600/30',
    popular: 'bg-orange-800/30 text-orange-300 border-orange-600/30',
    award: 'bg-yellow-800/30 text-yellow-300 border-yellow-600/30',
    special: 'bg-purple-800/30 text-purple-300 border-purple-600/30'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2 py-1', 
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium border transition-all duration-200 hover:scale-105",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <span>{category}</span>
      {count !== undefined && (
        <span className="opacity-75">({count})</span>
      )}
    </span>
  );
} 