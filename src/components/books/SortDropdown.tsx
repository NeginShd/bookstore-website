'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SortDropdownProps {
  onSortChange: (sortBy: string, order: string) => void;
  currentSortBy: string;
  currentOrder: string;
}

const sortOptions = [
  { value: "title-asc", label: "عنوان (صعودی)" },
  { value: "title-desc", label: "عنوان (نزولی)" },
  { value: "price-asc", label: "قیمت (ارزان‌ترین)" },
  { value: "price-desc", label: "قیمت (گران‌ترین)" },
  // Add more options like date, popularity if available in API/data
];

export default function SortDropdown({ onSortChange, currentSortBy, currentOrder }: SortDropdownProps) {
  const currentSortValue = `${currentSortBy}-${currentOrder}`;

  const handleChange = (value: string) => {
    const [sortBy, order] = value.split('-');
    onSortChange(sortBy, order);
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort-select" className="text-sm font-medium text-green-200">مرتب‌سازی بر اساس:</Label>
      <Select value={currentSortValue} onValueChange={handleChange}>
        <SelectTrigger id="sort-select" className="w-[180px] bg-green-800/70 border-green-700 text-white placeholder:text-green-300 focus:ring-green-500">
          <SelectValue placeholder="انتخاب کنید..." />
        </SelectTrigger>
        <SelectContent className="bg-green-900 text-white border-green-700">
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-green-700">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 