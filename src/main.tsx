try {
  let _fetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get() { return _fetch; },
    set(val) { _fetch = val; },
    configurable: true,
    enumerable: true
  });
} catch (e) {
  // Ignore if fetch cannot be redefined
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
