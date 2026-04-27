import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import EmpresaLogin from './pages/Empresa/Login/EmpresaLogin';
import EmpresaHome from './pages/Empresa/Home/EmpresaHome';
import EmpresaGatos from './pages/Empresa/Gatos/EmpresaGatos';
import EmpresaGatosNovo from './pages/Empresa/Gatos/EmpresaGatosNovo';
import Home from './pages/Home/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Usuário comum */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Empresa */}
        <Route path="/empresa/login" element={<EmpresaLogin />} />
        <Route path="/empresa/home" element={<EmpresaHome />} />
        <Route path="/empresa/gatos" element={<EmpresaGatos />} />
        <Route path="/empresa/gatos/novo" element={<EmpresaGatosNovo />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/empresa/matches" element={<EmpresaMatches />} /> */}
        {/* <Route path="/empresa/perfil"  element={<EmpresaPerfil />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
