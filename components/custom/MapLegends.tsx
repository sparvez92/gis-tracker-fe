'use client';

import Image from 'next/image';

import { Separator } from '../ui/separator';
import { Globe, Layers } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { BASEMAPS } from '@/constants';
import { cn } from '@/lib/utils';

function MapLegends() {
  const { baseMap, setBaseMap } = useAuthStore();

  return (
    <nav className="flex h-full min-h-screen max-w-[258px] flex-col gap-4">
      <Image src="/logo.png" alt="logo" width={126} height={43} className="m-5 self-center" />

      <div className="flex flex-col gap-6 px-4">
        <h4 className="flex h-10! flex-1 items-center gap-2 rounded-xl text-lg font-semibold text-white">
          <Layers size={18} /> Legends
        </h4>

        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Gas Emergency</span>
            <div className="rounded-xs bg-white p-1">
              <img src="/icons/marker-blue.svg" className="h-[15px] w-[15px]" />{' '}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Electric Emergency</span>
            <div className="rounded-xs bg-white p-1">
              <img src="/icons/marker-red.svg" className="h-[15px] w-[15px]" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Permit</span>
            <div className="rounded-xs bg-white p-1">
              <img src="/icons/marker-green.svg" className="h-[15px] w-[15px]" />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="px-4">
        <h4 className="flex h-10! flex-1 items-center gap-2 rounded-xl text-lg font-semibold text-white">
          <Globe size={18} /> Base Maps
        </h4>
        {/* Grid */}
        <div className="mt-4 grid grid-cols-2 gap-6">
          {Object.keys(BASEMAPS).map((key) => {
            const i = BASEMAPS[key];
            return (
              <div
                key={i.label}
                className="cursor-pointer"
                onClick={() => {
                  setBaseMap(key);
                }}
              >
                <img
                  src={i.image}
                  alt="Basemap preview"
                  className={cn(
                    'h-[97px] w-full object-cover',
                    baseMap === key ? 'ring-4 ring-white' : ''
                  )}
                />
                <span className="mt-2 block text-center text-sm font-medium text-white">
                  {i.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default MapLegends;
