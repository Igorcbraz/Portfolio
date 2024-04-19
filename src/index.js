import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import 'aos/dist/aos.css'
import './styles/global.css'

const root = document.getElementById('root')
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
