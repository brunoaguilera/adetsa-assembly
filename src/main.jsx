import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeflex/primeflex.css'; // Corrección en la ruta de primeflex
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import './styles.css';

import { ConsultaSocio } from './components/ConsultaSocio';
import { InquiryApp } from './components/InquiryApp';
import { VotoSocio } from './components/VotoSocio';
import { InquiryCandidatosApp } from './components/InquiryCandidatosApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route path="/consultasocio" element={<ConsultaSocio />} /> {/* Cambiar component a element */}
          <Route path="/respuestas" element={<InquiryApp />} /> {/* Cambiar component a element */}
          <Route path="/voto" element={<VotoSocio />} /> {/* Cambiar component a element */}
          <Route path="/consultacandidatos" element={<InquiryCandidatosApp />} /> {/* Cambiar component a element */}
          <Route path="*" element={<ConsultaSocio />} /> {/* Esta es la ruta por defecto */}
        </Routes>
      </Router>
    </PrimeReactProvider>
  </React.StrictMode>
);