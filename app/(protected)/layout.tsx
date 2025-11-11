'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from '@/components/custom/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-screen">
      {/* Drawer for small screens */}
      <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 left-3 md:hidden"
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
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex max-w-full md:max-w-[calc(100vw-258px)] flex-1 flex-col">
        
        {children}
        </main>
    </div>
  );
}
