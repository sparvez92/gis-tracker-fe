import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = {
  className?: string;
  children?: ReactNode;
  showShadow?: boolean;
};

const Section = ({ className = '', showShadow, children }: Props) => {
  return (
    <div
      className={clsx(
        `bg-white p-4`,
        className,
        showShadow && 'shadow-[6px_6px_54px_0px_#0000000D]'
      )}
    >
      {children}
    </div>
  );
};

export default Section;
