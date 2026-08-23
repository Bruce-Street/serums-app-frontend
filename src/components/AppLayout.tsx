import type { PropsWithChildren } from 'react';
import { TopBar } from '../features/TopBar';
import { FiltersPanel } from '../features/FiltersPanel';
import { PlazaInfoPanel } from '../features/PlazaInfoPanel';
import { FavoritesPanel } from '../features/FavoritesPanel';
import { ComparePanel } from '../features/ComparePanel';
import { CompareFloatingBar } from '../features/CompareFloatingBar';
import { DecisionProfileCard } from '../features/DecisionProfileCard';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50">
      <TopBar />
      <div className="flex-1 flex overflow-hidden relative">
        <FiltersPanel />
        <main className="flex-1 relative z-0">{children}</main>
        <DecisionProfileCard />
        <PlazaInfoPanel />
        <FavoritesPanel />
        <ComparePanel />
        <CompareFloatingBar />
      </div>
    </div>
  );
}
