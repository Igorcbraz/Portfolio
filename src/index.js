import React from 'react'
import ReactDOM from 'react-dom'

// eslint-disable-next-line import/extensions
import App from './App.jsx'

import 'aos/dist/aos.css'
import './styles/global.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
