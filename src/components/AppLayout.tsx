import type { PropsWithChildren } from 'react';
import { TopBar } from '../features/TopBar';
import { FiltersPanel } from '../features/FiltersPanel';
import { PlazaInfoPanel } from '../features/PlazaInfoPanel';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <TopBar />
      <div className="flex-1 flex overflow-hidden relative">
        <FiltersPanel />
        <main className="flex-1 relative z-0">{children}</main>
        <PlazaInfoPanel />
      </div>
    </div>
  );
}
