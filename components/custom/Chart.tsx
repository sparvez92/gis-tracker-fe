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

export const description = 'An interactive area chart';

const chartData = [
  // January
  { year: 2025, date: '2025-01-05', month: 'January', project: 345 },
  { year: 2025, date: '2025-01-12', month: 'January', project: 289 },
  { year: 2025, date: '2025-01-19', month: 'January', project: 421 },
  { year: 2025, date: '2025-01-27', month: 'January', project: 368 },

  // February
  { year: 2025, date: '2025-02-03', month: 'February', project: 277 },
  { year: 2025, date: '2025-02-10', month: 'February', project: 418 },
  { year: 2025, date: '2025-02-17', month: 'February', project: 199 },
  { year: 2025, date: '2025-02-25', month: 'February', project: 354 },

  // March
  { year: 2025, date: '2025-03-04', month: 'March', project: 390 },
  { year: 2025, date: '2025-03-12', month: 'March', project: 278 },
  { year: 2025, date: '2025-03-19', month: 'March', project: 501 },
  { year: 2025, date: '2025-03-26', month: 'March', project: 333 },

  // April
  { year: 2025, date: '2025-04-02', month: 'April', project: 482 },
  { year: 2025, date: '2025-04-10', month: 'April', project: 241 },
  { year: 2025, date: '2025-04-18', month: 'April', project: 503 },
  { year: 2025, date: '2025-04-25', month: 'April', project: 367 },

  // May
  { year: 2025, date: '2025-05-03', month: 'May', project: 411 },
  { year: 2025, date: '2025-05-10', month: 'May', project: 298 },
  { year: 2025, date: '2025-05-17', month: 'May', project: 456 },
  { year: 2025, date: '2025-05-25', month: 'May', project: 384 },

  // June
  { year: 2025, date: '2025-06-04', month: 'June', project: 232 },
  { year: 2025, date: '2025-06-11', month: 'June', project: 472 },
  { year: 2025, date: '2025-06-19', month: 'June', project: 347 },
  { year: 2025, date: '2025-06-27', month: 'June', project: 405 },

  // July
  { year: 2025, date: '2025-07-05', month: 'July', project: 318 },
  { year: 2025, date: '2025-07-12', month: 'July', project: 482 },
  { year: 2025, date: '2025-07-20', month: 'July', project: 266 },
  { year: 2025, date: '2025-07-28', month: 'July', project: 509 },

  // August
  { year: 2025, date: '2025-08-03', month: 'August', project: 298 },
  { year: 2025, date: '2025-08-10', month: 'August', project: 514 },
  { year: 2025, date: '2025-08-18', month: 'August', project: 327 },
  { year: 2025, date: '2025-08-26', month: 'August', project: 463 },

  // September
  { year: 2025, date: '2025-09-04', month: 'September', project: 389 },
  { year: 2025, date: '2025-09-11', month: 'September', project: 246 },
  { year: 2025, date: '2025-09-19', month: 'September', project: 512 },
  { year: 2025, date: '2025-09-27', month: 'September', project: 333 },

  // October
  { year: 2025, date: '2025-10-05', month: 'October', project: 275 },
  { year: 2025, date: '2025-10-13', month: 'October', project: 409 },
  { year: 2025, date: '2025-10-20', month: 'October', project: 512 },
  { year: 2025, date: '2025-10-28', month: 'October', project: 384 },

  // November
  { year: 2025, date: '2025-11-04', month: 'November', project: 301 },
  { year: 2025, date: '2025-11-11', month: 'November', project: 468 },
  { year: 2025, date: '2025-11-19', month: 'November', project: 259 },
  { year: 2025, date: '2025-11-27', month: 'November', project: 517 },

  // December
  { year: 2025, date: '2025-12-03', month: 'December', project: 377 },
  { year: 2025, date: '2025-12-11', month: 'December', project: 492 },
  { year: 2025, date: '2025-12-19', month: 'December', project: 268 },
  { year: 2025, date: '2025-12-27', month: 'December', project: 523 },
];

const chartConfig = {
  projects: {
    label: 'Projects',
  },
  desktop: {
    label: 'Projects',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export default function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState(new Date().getFullYear().toString());

  const filteredData = chartData.filter((item) => item.year.toString() === timeRange);

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
          <AreaChart data={filteredData}>
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
              dataKey="project"
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
