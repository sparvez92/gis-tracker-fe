'use client';
import CommonModal from '@/components/custom/CommonModal';
import Field from '@/components/custom/Field';
import FileUploadField from '@/components/custom/FileUploadField';
import PrimaryButton from '@/components/custom/PrimaryButton';
import { Form } from '@/components/ui/form';
import { uploadProjectsCsv } from '@/lib/fetcher';
import { notify } from '@/lib/utils';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [errorPermitNos, setErrorPermitNos] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    uploadProjectsCsv(values.file)
      .then((res) => {
        if (res.errors?.length > 0) {
          console.log('Errors:', res.errors);
          setOpen(true);
          setErrorPermitNos(res.errors);
        } else {
          form.resetField("file");
          notify('Projects uploaded successfully!');
        }
      })
      .catch((err) => {
        console.error('Upload failed:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="flex flex-col gap-6 md:gap-10" onSubmit={form.handleSubmit(onSubmit)}>
          <FileUploadField form={form} name="file" label="" accept=".csv" maxSizeMB={5} />

          <PrimaryButton
            className="max-w-[274px] self-center"
            label="Add Now"
            type="submit"
            isLoading={isLoading}
          />
        </form>
      </Form>

      <CommonModal open={open} setOpen={setOpen} title="Error in Permit #s">
        <div>
          <p className="mb-4 font-medium text-primary text-sm">The following Permit #s had errors during upload:</p>
          <ul className="list-inside list-disc">
            {errorPermitNos.map((permitNo) => (
              <li className='text-primary text-sm' key={permitNo}>{permitNo}</li>
            ))}
          </ul>
        </div>
      </CommonModal>
    </div>
  );
};

export default UploadForm;
