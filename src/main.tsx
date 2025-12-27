import { QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from './app/store';
import { fetchAuthedID } from './app/store/slices/authedIDSlice';
import { fetchRooms } from './app/store/slices/roomSlice';
import { fetchPeople } from './app/store/slices/personSlice';
import { fetchExits } from './app/store/slices/exitSlice';

import { Provider as UIProvider } from '@/lib/components/ui/provider';
import Page404 from '@/lib/pages/404';
import { queryClient } from '@/lib/services/constants';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// fonts
import '@fontsource-variable/plus-jakarta-sans';

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => (
    <div className="mx-auto">
      <p>Loading...</p>
    </div>
  ),
  defaultNotFoundComponent: () => <Page404 />,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  await store.dispatch(fetchAuthedID());
  await store.dispatch(fetchPeople());
  await store.dispatch(fetchRooms());
  await store.dispatch(fetchExits());
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <UIProvider>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider store={store}>
            <RouterProvider router={router} />
          </ReduxProvider>
        </QueryClientProvider>
      </UIProvider>
    </StrictMode>,
  );
}
