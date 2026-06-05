import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import Home from './pages/Home/Home';
import PerfilUsuario from './pages/Perfil/PerfilUsuario';
import Curtidas from './pages/Curtidas/Curtidas';
import Matches from './pages/Matches/Matches';
import GatoDetalhe from './pages/Gato/GatoDetalhe';
import EmpresaLogin from './pages/Empresa/Login/EmpresaLogin';
import EmpresaHome from './pages/Empresa/Home/EmpresaHome';
import EmpresaGatos from './pages/Empresa/Gatos/EmpresaGatos';
import EmpresaGatosNovo from './pages/Empresa/Gatos/EmpresaGatosNovo';
import EmpresaGatosEditar from './pages/Empresa/Gatos/EmpresaGatosEditar';
import EmpresaPerfil from './pages/Empresa/Perfil/EmpresaPerfil';
import EmpresaMatches from './pages/Empresa/Matches/EmpresaMatches';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Usuário */}
        <Route path="/login"    element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home"     element={<Home />} />

        {/* Páginas com bottom nav — a implementar */}
        <Route path="/curtidas" element={<Curtidas />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/perfil"     element={<PerfilUsuario />} />
        <Route path="/gato/:id"   element={<GatoDetalhe />} />

        {/* Empresa */}
        <Route path="/empresa/login"      element={<EmpresaLogin />} />
        <Route path="/empresa/home"       element={<EmpresaHome />} />
        <Route path="/empresa/gatos"      element={<EmpresaGatos />} />
        <Route path="/empresa/gatos/novo" element={<EmpresaGatosNovo />} />
        <Route path="/empresa/gatos/editar/:id" element={<EmpresaGatosEditar />} />
        <Route path="/empresa/matches"  element={<EmpresaMatches />} />
        <Route path="/empresa/perfil"   element={<EmpresaPerfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;