'use client';

import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  label: string;
  name: Path<T>;
  placeholder?: string;
  type?: string;
};

const Field = <T extends FieldValues>({
  label,
  form,
  name,
  placeholder,
  type = 'text',
}: Props<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary text-lg font-semibold">{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className="border-border bg-input-bg placeholder:text-placeholder h-14 rounded-lg border text-lg font-semibold text-gray-600 focus-visible:border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-300"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default Field;
