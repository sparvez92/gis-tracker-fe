'use client';

import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  label: string;
  name: Path<T>;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  rows?: number;
};

const TextareaField = <T extends FieldValues>({
  label,
  form,
  name,
  placeholder,
  className,
  containerClassName = '',
  rows = 4,
}: Props<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && (
            <FormLabel className="text-primary text-sm font-medium">
              {label}
            </FormLabel>
          )}

          <FormControl>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              className={cn(
                'border-border bg-input-bg placeholder:text-placeholder rounded-lg border text-lg font-semibold text-gray-600 focus-visible:border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-300',
                className
              )}
              {...field}
            />
          </FormControl>

          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default TextareaField;
