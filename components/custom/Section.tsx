import { ReactNode } from "react";

type Props = {
  className?: string;
  children?: ReactNode;
};

const Section = ({ className, children }: Props) => {
  return (
    <div className={`bg-white p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Section;