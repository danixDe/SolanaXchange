import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Buffer } from 'buffer';
import process from 'process';
import {BrowserRouter as Router} from 'react-router-dom'
if (!window.Buffer) window.Buffer = Buffer;
if (!window.process) window.process = process;createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Router>
    <App />
    </Router>
  </StrictMode>,
  
)
