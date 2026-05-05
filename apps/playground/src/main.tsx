import { RouterProvider, createHashHistory, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { routeTree } from './routeTree.gen';

const history = window.location.protocol === 'file:' ? createHashHistory() : undefined;

const router = createRouter({ routeTree, defaultPreload: 'intent', history });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const container = document.getElementById('root');
if (!container) throw new Error('#root container not found');

createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
