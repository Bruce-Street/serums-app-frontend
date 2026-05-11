import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/AppLayout';
import { MapView } from './map/MapView';

const queryClient = new QueryClient();

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
