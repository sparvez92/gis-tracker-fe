'use client';

import Field from '@/components/custom/Field';

import PrimaryButton from '@/components/custom/PrimaryButton';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const formSchema = z.object({
  permitNo: z.string().min(1, { message: 'Permit number is required.' }),
  townName: z.string().min(1, { message: 'Town name is required.' }),
});

const SettingForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permitNo: '',
      townName: '',
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
          <Field form={form} name="townName" label="Town Name" placeholder="Enter Town Name" />
        </div>

        <PrimaryButton label="Add Project" type="submit" isLoading={isLoading} />
      </form>
    </Form>
  );
};

export default SettingForm;
