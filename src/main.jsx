import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// Ponto de entrada da aplicação: pega a <div id="root"> do index.html
// e renderiza o componente <App /> dentro dela.
// O StrictMode não muda nada visualmente — ele só ativa avisos extras
// em desenvolvimento para nos ajudar a encontrar erros comuns.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
