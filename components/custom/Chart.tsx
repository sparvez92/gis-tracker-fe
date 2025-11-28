'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Section from './Section';
import { YEARS_OPTIONS } from '@/constants';
import { fetchProjectByYear } from '@/lib/fetcher';

export const description = 'An interactive area chart';

const chartConfig = {
  total: {
    label: 'Projects',
  },
  desktop: {
    label: 'Projects',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export default function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<{ date: string; total: number }[]>([]);


  const fetchProjects = () => {
    setIsLoading(true);
    fetchProjectByYear(timeRange)
      .then((res) => {
        console.log('Projects by year -->>', res);
        if (res?.length > 0) setData(res);
        else {
          setData([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    if (timeRange) fetchProjects();
  }, [timeRange]);

  return (
    <Section className="mt-4 rounded-[14px] py-4" showShadow>
      <div className="flex items-center gap-2 space-y-0 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <h2 className="text-2xl font-bold">Project By Year</h2>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-40 rounded-sm outline-none sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="2025" />
          </SelectTrigger>
          <SelectContent className="rounded-sm">
            {YEARS_OPTIONS.map((option) => (
              <SelectItem value={option.value} className="rounded-lg">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full bg-white">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%" stopColor="rgba(67, 121, 238, 0.16)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.176942)" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    console.log({ value });
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="#28246F"
              stackId="a"
            />
          </AreaChart>
          
        </ChartContainer>
      </div>
    </Section>
  );
}
