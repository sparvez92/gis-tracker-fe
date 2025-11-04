'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  label: string;
  isLoading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
};

const PrimaryButton = ({
  label,
  isLoading = false,
  className,
  type = 'button',
  onClick,
  disabled,
}: Props) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'w-full h-14 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2',
        'bg-secondary hover:bg-secondary/90 cursor-pointer',
        (disabled || isLoading) && 'opacity-80 cursor-not-allowed!',
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        label
      )}
    </Button>
  );
};

export default PrimaryButton;
