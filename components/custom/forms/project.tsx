'use client';

import Field from '@/components/custom/Field';
import SelectField from '@/components/custom/SelectField';
import DatePickerField from '@/components/custom/DatePickerField';
import PrimaryButton from '@/components/custom/PrimaryButton';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import LocationPickerField from '../LocationPickerField';

// Options for dropdowns
const yearOptions = [
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
];

const projectTypeOptions = [
  { label: 'Road Construction', value: 'road_construction' },
  { label: 'Bridge Repair', value: 'bridge_repair' },
  { label: 'Drainage Maintenance', value: 'drainage_maintenance' },
];

const formSchema = z.object({
  permitNo: z.string().min(1, { message: 'Permit number is required.' }),
  year: z.string().min(1, { message: 'Year is required.' }),
  townName: z.string().min(1, { message: 'Town name is required.' }),
  projectType: z.string().min(1, { message: 'Project type is required.' }),
  startDate: z.date({ message: 'Start date is required.' }),
  endDate: z.date({ message: 'End date is required.' }),
  restorationStartDate: z.date({ message: 'Restoration start date is required.' }),
  restorationEndDate: z.date({ message: 'Restoration end date is required.' }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
  }),
});

const ProjectForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permitNo: '',
      year: '',
      townName: '',
      projectType: '',
      location: {
        lat: undefined,
        lng: undefined,
        address: '',
      }
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.push('/');
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-7"
      >
        <div className="grid w-full grid-cols-1 gap-7 md:grid-cols-2">
          <Field form={form} name="permitNo" label="Permit #" placeholder="Enter permit number" />
          <SelectField
            form={form}
            name="year"
            label="Year"
            placeholder="Select year"
            options={yearOptions}
          />
          <Field form={form} name="townName" label="Town Name" placeholder="Enter Town Name" />
          <SelectField
            form={form}
            name="projectType"
            label="Project Type"
            placeholder="Select project type"
            options={projectTypeOptions}
          />
          <DatePickerField form={form} name="startDate" label="Start Date" />
          <DatePickerField form={form} name="endDate" label="End Date" />
          <DatePickerField form={form} name="restorationStartDate" label="Restoration Start Date" />
          <DatePickerField form={form} name="restorationEndDate" label="Restoration End Date" />
        </div>

        <LocationPickerField form={form} name="location" label="Add Location" />

        <PrimaryButton label="Add Project" type="submit" isLoading={isLoading} />
      </form>
    </Form>
  );
};

export default ProjectForm;
