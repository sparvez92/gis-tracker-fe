'use client';
import Field from '@/components/custom/Field';
import FileUploadField from '@/components/custom/FileUploadField';
import PrimaryButton from '@/components/custom/PrimaryButton';
import { Form } from '@/components/ui/form';
import { useAuthStore } from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

export const formSchema = z.object({
  file: z
    .instanceof(File, { message: 'File is required' })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File must be less than 5MB',
    })
    .refine((file) => file.name.endsWith('.csv'), {
      message: 'Only .csv files are allowed',
    }),
});


const UploadForm = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);
    // Mock login process
    new Promise((resolve) => {
      setTimeout(() => {
        login('mock-token-123456');
        setIsLoading(false);
        router.push('/');
        resolve(true);
      });
    });
  }
  return (
    <div className="w-full">
      <Form {...form}>
        <form className="flex flex-col gap-6 md:gap-10" onSubmit={form.handleSubmit(onSubmit)}>
          <FileUploadField
            form={form}
            name="file"
            label=""
            accept=".csv"
            maxSizeMB={5}
          />

          <PrimaryButton className='max-w-[274px] self-center' label="Add Now" type="submit" isLoading={isLoading} />
        </form>
      </Form>
    </div>
  );
};

export default UploadForm;
