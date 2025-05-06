import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Buffer } from 'buffer';
import {BrowserRouter as Router} from 'react-router-dom'
;(window as any).Buffer = Buffer;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
    <App />
    </Router>
  </StrictMode>,
)
