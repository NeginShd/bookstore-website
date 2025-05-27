'use client';

import React from 'react'; // Added this line
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
// Removed type React from 'react'; as it's not needed when React is imported directly

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = React.useState(initialQuery);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="جستجو بر اساس عنوان، نویسنده، یا شابک..."
        className="ps-10 sm:ps-12 py-3 sm:py-4 text-base sm:text-lg rounded-2xl font-bold bg-card text-card-foreground placeholder:text-green-400 shadow-lg border-2 border-border focus:border-green-400 focus:ring-2 focus:ring-green-400/60 focus:bg-card transition-all duration-200 backdrop-blur-md hover:shadow-green-400/20"
        aria-label="جستجوی کتاب"
      />
      <span className="absolute start-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="h-6 w-6 text-green-400 drop-shadow-lg" />
      </span>
    </div>
  );
}
