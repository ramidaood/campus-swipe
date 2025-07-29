import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/dom-patch' // Apply DOM patch early

createRoot(document.getElementById("root")!).render(<App />);
