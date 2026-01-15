import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './routes/AppRouter'
import './index.css'  // IMPORTANT: Ceci doit être présent
import './styles/global.css' // Si vous avez un fichier global.css

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
)