'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from '@/components/custom/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MAP_ROUTE } from '@/constants';
import MapLegends from '@/components/custom/MapLegends';
import { useAuthStore } from '@/store/useAuthStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  const { init } = useAuthStore()

  useEffect(() => {
    init();
  }, [init])

  return (
    <div className="bg-background flex min-h-screen">
      {/* Drawer for small screens */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute top-3 left-3 md:hidden',
              pathName === MAP_ROUTE && 'bg-white md:flex'
            )}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-secondary min-h-screen w-65">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Sidebar for large screens */}
      <aside className="bg-secondary hidden min-h-screen flex-col border-r md:flex">
        {pathName === MAP_ROUTE ? <MapLegends /> : <Sidebar />}
      </aside>

      {/* Main content */}
      <main className="flex max-w-full flex-1 flex-col md:max-w-[calc(100vw-258px)]">
        {children}
      </main>
    </div>
  );
}
