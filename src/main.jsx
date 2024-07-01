import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'
import {Provider} from "react-redux"
import store from './redux/store.js'


// oncontextMenu={(e)=>e.preventDefault()}       ye chipka dena bhai app ke uupar wale div me

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

  <Provider store={store}>

  
  <HelmetProvider>
  <CssBaseline />
  <div >
  <App />
  </div>
    
  </HelmetProvider>

  </Provider>


  </React.StrictMode>,
)
