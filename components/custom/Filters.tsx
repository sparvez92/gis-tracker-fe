'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import Field from './Field';
import SelectField from './SelectField';
import DatePickerField from './DatePickerField';
import { IProjectFilters, UPLOAD_CSV, YEARS_OPTIONS } from '@/constants';
import { useRouter } from 'next/navigation';
import { downloadProjectsExcel } from '@/lib/fetcher';
import { notify } from '@/lib/utils';

type Props = {
  onFilterChange?: (filters: IProjectFilters) => void;
  filters: IProjectFilters;
};

export default function SearchFilterHeader({ filters, onFilterChange = () => {} }: Props) {
  const router = useRouter();
  const form = useForm<IProjectFilters>({
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
      onFilterChange(values as IProjectFilters);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onFilterChange]);

  const clearFilters = () => {
    form.reset({
      search: '',
      year: '',
      startDate: undefined,
      endDate: undefined,
      restStartDate: undefined,
      restEndDate: undefined,
    });
  };

  const downloadExcel = () => {
    downloadProjectsExcel(filters).catch((err) => {
      notify(err.message || 'Failed to download CSV', 'error');
    })
  }

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
            className="bg-secondary hover:bg-secondary cursor-pointer text-sm font-bold hover:opacity-85"
          >
            Upload CSV
          </Button>

          <Button
            onClick={downloadExcel}
            type="button"
            className="bg-secondary hover:bg-secondary cursor-pointer text-sm font-bold hover:opacity-85"
          >
            Download CSV
          </Button>
        </div>

        {/* 🔽 IProjectFilters Row */}
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

          <Button
            onClick={clearFilters}
            type="button"
            className="bg-secondary hover:bg-secondary cursor-pointer text-sm font-bold hover:opacity-85"
          >
            Clear Filters
          </Button>
        </div>
      </form>
    </Form>
  );
}
