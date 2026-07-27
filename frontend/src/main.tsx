import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';

if (!window.Buffer) {
  window.Buffer = Buffer;
}

import './index.css';
import { AppWithProviders } from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>,
);
