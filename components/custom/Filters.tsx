'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import Field from './Field';
import SelectField from './SelectField';
import DatePickerField from './DatePickerField';
import { UPLOAD_CSV, YEARS_OPTIONS } from '@/constants';
import { useRouter } from 'next/navigation';

type Filters = {
  search: string;
  year: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  restStartDate: Date | undefined;
  restEndDate: Date | undefined;
};

type Props = {
  onFilterChange?: (filters: Filters) => void;
};

export default function SearchFilterHeader({ onFilterChange = () => {} }: Props) {
  const router = useRouter();
  const form = useForm<Filters>({
    defaultValues: {
      search: '',
      year: '',
      startDate: undefined,
      endDate: undefined,
      restStartDate: undefined,
      restEndDate: undefined,
    },
  });

  // Trigger API when form changes
  useEffect(() => {
    const subscription = form.watch((values) => {
      onFilterChange(values as Filters);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onFilterChange]);

  return (
    <Form {...form}>
      <form className="w-full rounded-md">
        {/* 🔍 Search + Upload */}
        <div className="flex items-center gap-3">
          <Field
            form={form}
            label=""
            name="search"
            placeholder="Search projects"
            className="h-10 w-full flex-1 rounded-sm border-[#D5D5D5] bg-white"
            containerClassName="w-full"
          />
          <Button
            onClick={() => router.push(UPLOAD_CSV)}
            type="button"
            className="bg-secondary hover:bg-secondary text-sm font-bold hover:opacity-85 cursor-pointer"
          >
            Upload CSV
          </Button>
        </div>

        {/* 🔽 Filters Row */}
        <div className="my-3 grid grid-cols-1 items-center gap-3 md:grid-cols-2 lg:grid-cols-4">
          {/* Status */}
          <SelectField
            form={form}
            options={YEARS_OPTIONS}
            label=""
            name="year"
            placeholder="Select Year"
            className="h-10! w-full flex-1 rounded-sm! border-[#D5D5D5] bg-white"
          />

          <DatePickerField
            form={form}
            label=""
            placeholder="Start Date"
            name="startDate"
            className="h-10! w-full flex-1 rounded-sm! border-[#D5D5D5] bg-white"
          />

          <DatePickerField
            form={form}
            label=""
            placeholder="End Date"
            name="endDate"
            className="h-10! w-full flex-1 rounded-sm! border-[#D5D5D5] bg-white"
          />

          <DatePickerField
            form={form}
            label=""
            placeholder="Rest. Start Date"
            name="restStartDate"
            className="h-10! w-full flex-1 rounded-sm! border-[#D5D5D5] bg-white"
          />

          <DatePickerField
            form={form}
            label=""
            placeholder="Rest. End Date"
            name="restEndDate"
            className="h-10! w-full flex-1 rounded-sm! border-[#D5D5D5] bg-white"
          />
        </div>
      </form>
    </Form>
  );
}
