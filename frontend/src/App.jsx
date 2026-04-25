import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import EmpresaLogin from './pages/Empresa/Login/EmpresaLogin';
import EmpresaHome from './pages/Empresa/Home/EmpresaHome';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota raiz — redireciona pro login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Usuário comum */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Empresa */}
        <Route path="/empresa/login" element={<EmpresaLogin />} />
        {/* As demais rotas da empresa serão adicionadas aqui conforme forem criadas */}
        <Route path="/empresa/home"    element={<EmpresaHome />} />
        {/* <Route path="/empresa/gatos"   element={<EmpresaGatos />} /> */}
        {/* <Route path="/empresa/matches" element={<EmpresaMatches />} /> */}
        {/* <Route path="/empresa/perfil"  element={<EmpresaPerfil />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
