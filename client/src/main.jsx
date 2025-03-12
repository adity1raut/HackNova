import { StrictMode ,  React } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"
// import Faculty from './Faculty.jsx'
import App from "./App"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Faculty /> */}
    <App />
  </StrictMode>,
)
