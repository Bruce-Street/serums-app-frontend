import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/AppLayout';
import { MapView } from './map/MapView';
import { DEFAULT_STALE_TIME } from '@/constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME,
      refetchOnWindowFocus: false, // Prevents refetching when switching tabs
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <MapView />
      </AppLayout>
    </QueryClientProvider>
  );
}

export default App;
