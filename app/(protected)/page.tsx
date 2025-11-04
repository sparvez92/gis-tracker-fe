import ChartAreaInteractive from '@/components/custom/Chart';
import Section from '@/components/custom/Section';
import Title from '@/components/custom/Title';

export default function Home() {
  const data = [
    {
      title: 'Total Permit Projects',
      icon: '/icons/dashboard/icon.png',
      value: '40,689',
    },
    {
      title: 'Total Emergency Projects',
      icon: '/icons/dashboard/icon-1.png',
      value: '10,293',
    },
    {
      title: 'Completed Constructions',
      icon: '/icons/dashboard/icon-2.png',
      value: '89,000',
    },
    {
      title: 'Completed Restorations',
      icon: '/icons/dashboard/icon-3.png',
      value: '2,040',
    },
  ];
  return (
    <div className="px-8 py-14">
      <Title>Dashboard</Title>

      <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item, index) => (
          <Section showShadow key={index} className="rounded-[14px] p-4">
            <div className="mb-2 flex items-start justify-between gap-1">
              <h2 className="text-primary text-[16px] font-semibold text-wrap opacity-70">
                {item.title}
              </h2>
              <img src={item.icon} alt={item.title} className="h-[60px] w-[60px]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
          </Section>
        ))}
      </div>

      <ChartAreaInteractive />
    </div>
  );
}
