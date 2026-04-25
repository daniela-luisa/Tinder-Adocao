import EmpresaSidebar from '../../../components/EmpresaSidebar';
 
function EmpresaHome() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F3]">
      <EmpresaSidebar empresa={{ nome: 'MiauMatch' }} />
 
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Bem-vinda ao painel administrativo.</p>
      </main>
    </div>
  );
}
 
export default EmpresaHome;