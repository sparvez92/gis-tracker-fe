'use client';

import ChartAreaInteractive from '@/components/custom/Chart';
import { DataTable } from '@/components/custom/dataTable';
import Section from '@/components/custom/Section';
import Title from '@/components/custom/Title';
import { Skeleton } from '@/components/ui/skeleton';
import { COLUMNS, DUMMY_DATA } from '@/constants';
import { fetchSummary } from '@/lib/fetcher';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [summary, setSummary] = useState({
    totalPermit: '-',
    totalEmergency: '-',
    completedConstructions: '-',
    completedRestorations: '-',
  });

  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  const data = [
    {
      title: 'Total permit projects',
      icon: '/icons/dashboard/icon4.png',
      value: summary.totalPermit,
    },
    {
      title: 'Total emergency projects',
      icon: '/icons/dashboard/icon1.png',
      value: summary.totalEmergency,
    },
    {
      title: 'Total completed construction projects',
      icon: '/icons/dashboard/icon2.png',
      value: summary.completedConstructions,
    },
    {
      title: 'Total completed restoration projects',
      icon: '/icons/dashboard/icon3.png',
      value: summary.completedRestorations,
    },
  ];

  const getSummary = () => {
    fetchSummary()
      .then((res) => {
        console.log('summaryy -->>', res);
        setSummary({
          totalPermit: res.totalPermit,
          totalEmergency: res.totalEmergency,
          completedConstructions: res.completedConstructions,
          completedRestorations: res.completedRestorations,
        });
      })
      .finally(() => {
        setIsSummaryLoading(false);
      });
  };

  useEffect(() => {
    getSummary();
  }, []);

  return (
    <div className="px-8 py-14">
      <Title>Dashboard</Title>

      {isSummaryLoading ? (
        <SummaryLoading />
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((item, index) => (
            <Section showShadow key={index} className="rounded-[14px] p-4">
              <div className="mb-2 flex items-start justify-between gap-1">
                <h2 className="text-primary text-[16px] font-semibold text-wrap opacity-70">
                  {item.title}
                </h2>
                <Image
                  src={item.icon}
                  alt={item.title}
                  height={60}
                  width={60}
                  className="h-[60px] w-[60px]"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </Section>
          ))}
        </div>
      )}

      <ChartAreaInteractive />

      <div className="mt-7 w-full max-w-[100vw] overflow-hidden">
        <DataTable columns={COLUMNS} showPagination={false} />
      </div>
    </div>
  );
}

const SummaryLoading = () => {
  return (
    <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <Section showShadow key={item} className="w-full rounded-[14px] p-4">
          <div className="mb-2 flex w-full items-start justify-between gap-1">
            <Skeleton className="h-5 w-[65%] rounded-md" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <Skeleton className="h-8 w-10 rounded-md" />
        </Section>
      ))}
    </div>
  );
};
