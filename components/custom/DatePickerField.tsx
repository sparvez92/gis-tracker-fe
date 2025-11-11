'use client';

import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  label: string;
  name: Path<T>;
  placeholder?: string;
  className?: string
  parentClassName?: string
};

const DatePickerField = <T extends FieldValues>({
  form,
  label,
  name,
  placeholder = 'Select date',
  className = "",
  parentClassName = ""
}: Props<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex flex-col gap-0 ${parentClassName}`}>
          <FormLabel className="text-primary text-sm font-medium">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    'border-border bg-input-bg hover:bg-input-bg text-input h-14 justify-start rounded-lg text-left text-sm! font-semibold',
                    !field.value && 'text-placeholder',
                    className
                  )}
                >
                  {field.value ? format(field.value, 'dd-MM-yyyy') : <span>{placeholder}</span>}
                  <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
              />
            </PopoverContent>
          </Popover>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;
