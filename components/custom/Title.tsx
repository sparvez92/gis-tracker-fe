type Props = {
  children: React.ReactNode;
};

const Title = ({ children }: Props) => {
  return <h1 className="text-primary text-[32px] leading-[-0.11px] font-bold">{children}</h1>;
};

export default Title;
