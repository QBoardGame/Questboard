 '../styles/index.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { AppShell } from '../ui/layout/AppShell';
import { store } from '../shared/store';

async function initDesktop() {

  const root = document.getElementById('app');

  if (!root) return;

  createRoot(root).render(
    <Provider store={store}>
      <AppShell />
    </Provider>,
  );
}

initDesktop();
