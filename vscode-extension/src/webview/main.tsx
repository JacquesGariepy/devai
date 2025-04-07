import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './main.css';
import { ChatApp } from './components/ChatApp';

// Point d'entrée principal de l'application React
ReactDOM.render(
  <React.StrictMode>
    <ChatApp />
  </React.StrictMode>,
  document.getElementById('app')
);
