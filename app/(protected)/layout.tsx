'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/custom/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Drawer for small screens */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden m-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Sidebar for large screens */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-secondary p-4">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Optional topbar */}
        <header className="flex items-center justify-between border-b p-4 bg-background">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}


