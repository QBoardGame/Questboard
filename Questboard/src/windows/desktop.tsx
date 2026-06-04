import '../styles/index.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { AppShell } from '../ui/layout/AppShell';
import { store } from '../shared/store';
import { wsClient } from '../lib/wsClient';

function initDesktop() {
  wsClient.connect().catch((error) => {
    console.error("WebSocket connection failed: ", error);
  })
  const root = document.getElementById('app');

  if (!root) return;

  const reactRoot = createRoot(root);
  reactRoot.render(
    <Provider store={store}>
      <AppShell />
    </Provider>,
  );
}

initDesktop();