import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProfileProvider } from './context/ProfileContext/ProfileContext.jsx'
import {LoaderProvider} from './context/LoaderContext.jsx'
import {ToastProvider} from './context/ToastContext.jsx'
import {ProgressBarProvider} from './context/ProgressBarContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <ProfileProvider>
    <LoaderProvider>
    <ToastProvider>
    <ProgressBarProvider>
    <App />
    </ProgressBarProvider>
    </ToastProvider>
    </LoaderProvider>
    </ProfileProvider>
)
const preloader = document.getElementById('preloader');
if (preloader) {
  preloader.classList.add('loaded');
  setTimeout(() => {
    preloader.remove();
  }, 500); 
}