'use client';

import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Sidebar from '@/components/custom/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen">
      {/* Drawer for small screens */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-secondary min-h-screen w-65">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Sidebar for large screens */}
      <aside className="bg-secondary min-h-screen w-65 flex-col border-r md:flex">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
