'use client';

import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
};

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  label: string;
  name: Path<T>;
  placeholder?: string;
  options: Option[];
  className?: string
};

const SelectField = <T extends FieldValues>({
  form,
  label,
  name,
  placeholder,
  options,
  className = ""
}: Props<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary text-sm font-semibold">{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className={cn("w-full border-border bg-input-bg placeholder:text-placeholder! h-14! rounded-lg! border text-sm font-semibold text-gray-600 focus-visible:border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-300", className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="border-border max-h-[45vh] rounded-lg border bg-white shadow-md">
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default SelectField;
