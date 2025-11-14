'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { IRoutes, ROUTES, SETTING_ROUTES } from '@/constants';
import clsx from 'clsx';
import { Separator } from '../ui/separator';

function Sidebar() {
  const pathname = usePathname();

  const renderItem = (item: IRoutes) => {
    const isActive = pathname === item.path;

    return (
      <div key={item.name} className="relative w-full">
        <a
          href={item.path}
          className={clsx(
            'mx-auto flex w-full max-w-[210px] items-center gap-4 rounded-[6px] px-6 py-4 text-sm font-medium text-white transition-all duration-200',
            isActive && 'text-secondary! bg-white'
          )}
        >
          <Image
            src={isActive ? item.darkIcon : item.lightIcon}
            alt={item.name}
            width={19}
            height={22}
          />

          {item.name}
        </a>
        {/* Active indicator bar */}
        {isActive && (
          <span className="absolute top-1/2 left-0 h-[50px] w-[5px] -translate-y-1/2 rounded-r-md bg-white"></span>
        )}
      </div>
    );
  };

  return (
    <nav className="flex h-full min-h-screen min-w-[258px] flex-col gap-4">
      <Image src="/logo.png" alt="logo" width={126} height={43} className="m-5 self-center" />

      <div className="flex flex-col items-center gap-1">
        {ROUTES.map((item: IRoutes) => renderItem(item))}
      </div>

      <div className="mt-auto">
        <Separator />

        <div className="mt-4 flex flex-col items-center gap-1">
          {SETTING_ROUTES.map((item: IRoutes) => renderItem(item))}
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
