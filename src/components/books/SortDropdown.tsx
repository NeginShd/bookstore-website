'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SortDropdownProps {
  onSortChange: (sortBy: string, order: string) => void;
  currentSortBy: string;
  currentOrder: string;
}

const sortOptions = [
  { value: "title-asc", label: "عنوان (صعودی)", description: "مرتب‌سازی بر اساس عنوان کتاب از الف تا ی" },
  { value: "title-desc", label: "عنوان (نزولی)", description: "مرتب‌سازی بر اساس عنوان کتاب از ی تا الف" },
  { value: "price-asc", label: "قیمت (ارزان‌ترین)", description: "مرتب‌سازی بر اساس قیمت از کم به زیاد" },
  { value: "price-desc", label: "قیمت (گران‌ترین)", description: "مرتب‌سازی بر اساس قیمت از زیاد به کم" },
  // Add more options like date, popularity if available in API/data
];

export default function SortDropdown({ onSortChange, currentSortBy, currentOrder }: SortDropdownProps) {
  const currentSortValue = `${currentSortBy}-${currentOrder}`;
  const currentOption = sortOptions.find(option => option.value === currentSortValue);

  const handleChange = (value: string) => {
    const [sortBy, order] = value.split('-');
    onSortChange(sortBy, order);
  };

  return (
    <div className="flex items-center gap-2" role="group" aria-labelledby="sort-label">
      <Label 
        id="sort-label" 
        htmlFor="sort-select" 
        className="text-sm font-medium text-green-200"
      >
        مرتب‌سازی بر اساس:
      </Label>
      <Select 
        value={currentSortValue} 
        onValueChange={handleChange}
        aria-labelledby="sort-label"
        aria-describedby="sort-description"
      >
        <SelectTrigger 
          id="sort-select" 
          className="w-[180px] bg-green-800/70 border-green-700 text-white placeholder:text-green-300 focus:ring-green-500"
          aria-label={`مرتب‌سازی فعلی: ${currentOption?.label || 'انتخاب نشده'}`}
        >
          <SelectValue placeholder="انتخاب کنید..." />
        </SelectTrigger>
        <SelectContent 
          className="bg-green-900 text-white border-green-700"
          role="listbox"
          aria-label="گزینه‌های مرتب‌سازی"
        >
          {sortOptions.map(option => (
            <SelectItem 
              key={option.value} 
              value={option.value} 
              className="cursor-pointer hover:bg-green-700 focus:bg-green-700"
              aria-describedby={`sort-option-${option.value}-desc`}
            >
              {option.label}
              <span 
                id={`sort-option-${option.value}-desc`} 
                className="sr-only"
              >
                {option.description}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div 
        id="sort-description" 
        className="sr-only"
        aria-live="polite"
      >
        {currentOption ? `مرتب‌سازی فعلی: ${currentOption.description}` : ''}
      </div>
    </div>
  );
} 