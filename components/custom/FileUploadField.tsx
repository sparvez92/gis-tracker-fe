'use client';

import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { UploadCloud } from 'lucide-react';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  label: string;
  name: Path<T>;
  accept?: string;
  maxSizeMB?: number;
};

const FileUploadField = <T extends FieldValues>({
  form,
  label,
  name,
  accept = '.csv',
  maxSizeMB = 5,
}: Props<T>) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file) return;

      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size exceeds ${maxSizeMB}MB.`);
        return;
      }

      if (!file.name.endsWith('.csv')) {
        alert('Only .csv files are allowed.');
        return;
      }

      form.setValue(name, file as any);
      setFileName(file.name);
    },
    [form, name, maxSizeMB]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className="w-full">
          <FormLabel className="text-primary text-sm font-medium">{label}</FormLabel>
          <FormControl>
            <label
              htmlFor={name}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              className={clsx(
                'bg-input-bg flex h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition',
                isDragging ? 'border-blue-400 bg-blue-50/50' : 'border-border hover:border-gray-300'
              )}
            >
              <Image src="/icons/upload.png" alt="Upload Icon" width={26} height={26} />
              {fileName ? (
                <p className="text-base font-medium text-gray-700">{fileName}</p>
              ) : (
                <p className="max-w-xs text-center text-sm font-medium text-[#A6A6A6]">
                  Drag & drop your file here or click to upload. <br />
                  Accepts CSV files only (up to 5MB).
                </p>
              )}
              <input
                id={name}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  );
};

export default FileUploadField;
