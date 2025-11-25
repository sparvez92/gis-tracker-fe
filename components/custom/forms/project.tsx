'use client';

import Field from '@/components/custom/Field';
import SelectField from '@/components/custom/SelectField';
import DatePickerField from '@/components/custom/DatePickerField';
import PrimaryButton from '@/components/custom/PrimaryButton';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import LocationPickerField from '../LocationPickerField';
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from '@/graphql/mutations/project.generated';
import { dateFormatter, PROJECTS_ROUTE, projectTypeOptions, YEARS_OPTIONS } from '@/constants';
import { Enum_Project_Project_Type, ProjectInput } from '@/types';
import { useGetSingleProjectQuery } from '@/graphql/queries/project.generated';
import { Skeleton } from '@/components/ui/skeleton';
import { notify } from '@/lib/utils';


const pcoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

const formSchema = z.object({
  permitNo: z.string().min(1, { message: 'Permit number is required.' }),
  layoutNo: z.string().min(1, { message: 'Layout number is required.' }),
  year: z.string().min(1, { message: 'Year is required.' }),
  permitCloseOut: z.string().min(1, { message: 'Permit Close Out is required.' }),
  townName: z.string().min(1, { message: 'Town name is required.' }),
  projectType: z.string().min(1, { message: 'Project type is required.' }),
  startDate: z.date({ message: 'Start date is required.' }).optional(),
  endDate: z.date({ message: 'End date is required.' }).optional(),
  restorationStartDate: z.date({ message: 'Restoration start date is required.' }).optional(),
  restorationEndDate: z.date({ message: 'Restoration end date is required.' }).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
  }),
});

const ProjectForm = ({ isUpdate = false }: { isUpdate?: boolean }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permitNo: '',
      layoutNo: '',
      townName: '',
      permitCloseOut: 'no',
      location: {
        lat: undefined,
        lng: undefined,
        address: '',
      },
    },
  });

  // hooks
  const router = useRouter();
  const params = useParams<{ id: string }>();
  // state
  const [isLoading, setIsLoading] = useState(false);

  // Queries
  const { data, isLoading: projectInfoLoading } = useGetSingleProjectQuery(
    { documentId: params?.id ?? '' },
    {
      enabled: isUpdate,
    }
  );

  // Mutations
  const { mutateAsync: createProjectMutation } = useCreateProjectMutation();
  const { mutateAsync: updateProjectMutation } = useUpdateProjectMutation();

  useEffect(() => {
    if (isUpdate && !projectInfoLoading && data?.project) {
      console.log('Data project ==>>', data.project);
      setTimeout(() => {
        if (data.project)
          form.reset({
            permitNo: data.project.permit_no || '',
            layoutNo: data.project.layout_no || '',
            year: data.project.year, // string for Select
            townName: data.project.town || '',
            projectType: data.project.project_type, // string for Select
            startDate: data.project.const_start_date
              ? new Date(data.project.const_start_date)
              : undefined,
            endDate: data.project.const_end_date
              ? new Date(data.project.const_end_date)
              : undefined,
            restorationStartDate: data.project.rest_start_date
              ? new Date(data.project.rest_start_date)
              : undefined,
            restorationEndDate: data.project.rest_end_date
              ? new Date(data.project.rest_end_date)
              : undefined,
            location: {
              lat: data.project.lat ? parseFloat(data.project.lat) : 0,
              lng: data.project.lng ? parseFloat(data.project.lng) : 0,
              address: data.project.address || '',
            },
            permitCloseOut: data.project.permit_close_out ? 'yes' : 'no',
          });
      }, 500);
    }
  }, [isUpdate, params?.id, data, projectInfoLoading, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);

    const payload: ProjectInput = {
      permit_no: values.permitNo,
      layout_no: values.layoutNo,
      year: values.year,
      town: values.townName,
      project_type: values.projectType as Enum_Project_Project_Type,
      const_start_date: values.startDate ? dateFormatter(values.startDate.toISOString()) : null,
      const_end_date: values.endDate ? dateFormatter(values.endDate.toISOString()) : null,
      rest_start_date: values.restorationStartDate
        ? dateFormatter(values.restorationStartDate.toISOString())
        : null,
      rest_end_date: values.restorationEndDate
        ? dateFormatter(values.restorationEndDate.toISOString())
        : null,
      lat: values.location.lat?.toString() || null,
      lng: values.location.lng?.toString() || null,
      address: values.location.address || null,
      permit_close_out: values.permitCloseOut === 'yes' ? true : false,
    };

    if (isUpdate) {
      updateProject(payload);
    } else {
      createProject(payload);
    }
  }

  const createProject = (payload: ProjectInput) => {
    createProjectMutation({
      data: payload,
    })
      .then(() => {
        notify('Project created successfully.');
        router.push(PROJECTS_ROUTE);
        form.reset();
      })
      .catch((err) => {
        console.error('create project error ==>>', err, err?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateProject = (payload: ProjectInput) => {
    updateProjectMutation({
      data: payload,
      documentId: params?.id || '',
    })
      .then(() => {
        notify("Project updated successfully");
        router.push(PROJECTS_ROUTE);
        form.reset();
      })
      .catch((err) => {
        console.error('update project error ==>>', err, err?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isUpdate && projectInfoLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-center gap-7"
      >
        <div className="grid w-full grid-cols-1 gap-7 md:grid-cols-2">
          <Field form={form} name="permitNo" label="Permit #" placeholder="Enter permit number" />
          <Field form={form} name="layoutNo" label="Layout #" placeholder="Enter layout number" />
          <SelectField
            form={form}
            name="year"
            label="Year"
            placeholder="Select year"
            options={YEARS_OPTIONS}
          />
          <Field form={form} name="townName" label="Town Name" placeholder="Enter Town Name" />
          <SelectField
            form={form}
            name="projectType"
            label="Project Type"
            placeholder="Select project type"
            options={projectTypeOptions}
          />
          <SelectField
            form={form}
            name="permitCloseOut"
            label="Permit Closed Out"
            placeholder="Permit Closed Out"
            options={pcoOptions}
          />
          <DatePickerField form={form} name="startDate" label="Construction Start Date" />
          <DatePickerField form={form} name="endDate" label="Construction End Date" />
          <DatePickerField form={form} name="restorationStartDate" label="Restoration Start Date" />
          <DatePickerField form={form} name="restorationEndDate" label="Restoration End Date" />
        </div>

        <LocationPickerField
          form={form}
          name="location"
          label="Add Location"
          lat={data?.project?.lat ?? ''}
          lng={data?.project?.lng ?? ''}
          address={data?.project?.address ?? ''}
        />

        <PrimaryButton
          label={isUpdate ? 'Update Project' : 'Add Project'}
          type="submit"
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
};

export default ProjectForm;

const LoadingSkeleton = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-7 md:grid-cols-2">
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />

      <Skeleton className="col-span-2 h-14 w-full" />
      <Skeleton className="col-span-2 h-40 w-full" />
    </div>
  );
};
