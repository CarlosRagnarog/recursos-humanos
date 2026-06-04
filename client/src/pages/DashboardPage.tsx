export default function DashboardPage() {
  const username = localStorage.getItem("username") || "Usuario";

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 px-8 py-5 text-white shadow">
        <h1 className="text-2xl font-bold">Sistema de Recursos Humanos</h1>
        <p className="text-sm text-slate-300">Bienvenido, {username}</p>
      </header>

      <main className="p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-lg font-bold text-slate-800">Personal</h2>
            <p className="mt-2 text-slate-500">Gestión del personal registrado.</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-lg font-bold text-slate-800">Documentos</h2>
            <p className="mt-2 text-slate-500">Correspondencia y archivos.</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-lg font-bold text-slate-800">Reportes</h2>
            <p className="mt-2 text-slate-500">Resumen administrativo.</p>
          </div>
        </div>
      </main>
    </div>
  );
}