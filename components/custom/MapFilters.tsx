'use client';

import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { useEffect } from 'react';
import Field from './Field';
import SelectField from './SelectField';
import { projectTypeOptions, YEARS_OPTIONS } from '@/constants';
import { Enum_Project_Project_Type } from '@/types';
import { Button } from '../ui/button';
import PrimaryButton from './PrimaryButton';

type Filters = {
  search: string;
  year: string;
  projectType: Enum_Project_Project_Type | '';
};

type Props = {
  onFilterChange?: (filters: Filters) => void;
};

export default function MapFilters({ onFilterChange = () => {} }: Props) {
  const form = useForm<Filters>({
    defaultValues: {
      search: '',
      year: '',
      projectType: '',
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
      <form className="w-full">
        {/* 🔽 Filters Row */}
        <div className="my-3 grid grid-cols-1 items-center gap-3 md:grid-cols-2 lg:grid-cols-4">
          {/* Status */}
          <div className="col-span-4">
            <Field
              form={form}
              label=""
              name="search"
              placeholder="Search projects"
              className="h-10 w-full flex-1 rounded-sm border-[#D5D5D5] bg-white"
              containerClassName="w-full"
            />
          </div>

          <SelectField
            form={form}
            options={YEARS_OPTIONS}
            label=""
            name="year"
            placeholder="Select Year"
            className="h-10! w-full flex-1 rounded-sm! border-[#D5D5D5] bg-white"
          />

          <SelectField
            form={form}
            options={projectTypeOptions}
            label=""
            name="projectType"
            placeholder="Select Project Type"
            className="h-10! w-full flex-1 rounded-sm! border-[#D5D5D5] bg-white"
          />
          
          <PrimaryButton label='Clear Filter' type='button' className='h-10 rounded-md' onClick={() => {
            form.reset({
              search: '',
              year: '',
              projectType: '',
            })
          }} />
        </div>
      </form>
    </Form>
  );
}
