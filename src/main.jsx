import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { createDemoData } from './data/demo';
import { storage } from './utils/storage';
import './index.css';

// First launch: seed realistic demo data. After that, user changes persist.
if (!storage.get('initialized', false)) storage.loadDemo(createDemoData());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
