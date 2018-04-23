import { Dashboard } from 'api/api';
import { AqueductRemote } from 'api/aqueduct-remote';
import { App } from 'app/app';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { accountStore } from 'stores/account-store';
import { marketStore } from 'stores/market-store';
import './index.scss';
import { tokenPairStore } from './stores/token-pair-store';

Dashboard.Initialize({ host: 'localhost:8662' });
AqueductRemote.Initialize({ host: 'localhost:8700' });

(async () => {
  try {
    await Promise.all([
      tokenPairStore.initialize(),
      marketStore.initialize(),
      accountStore.initialize()
    ]);
  } catch (err) { console.error(err); }

  ReactDOM.render((
    <HashRouter>
      <App />
    </HashRouter>
  ), document.getElementById('app'));
})();
