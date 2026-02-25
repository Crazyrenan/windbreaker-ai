import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import DelayPredictor from './pages/DelayPredictor';
import PriceOracle from './pages/PriceOracle';
import MainLayout from './components/MainLayout';

// Komponen untuk memproteksi rute dan membungkusnya dengan Sidebar Layout
const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = localStorage.getItem("user_token") !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTE PUBLIK */}
        {/* Ubah rute akar (/) untuk memanggil Landing, bukan redirect */}
        <Route path="/" element={<Landing />} /> 
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* RUTE TERPROTEKSI DENGAN SIDEBAR */}
        <Route 
          path="/dashboard" 
          element={<ProtectedLayout><Dashboard /></ProtectedLayout>} 
        />
        <Route 
          path="/delay-predictor" 
          element={<ProtectedLayout><DelayPredictor /></ProtectedLayout>} 
        />
        <Route 
          path="/price-oracle" 
          element={<ProtectedLayout><PriceOracle /></ProtectedLayout>} 
        />

        {/* FALLBACK: Jika rute tidak ditemukan, arahkan ke landing atau login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;