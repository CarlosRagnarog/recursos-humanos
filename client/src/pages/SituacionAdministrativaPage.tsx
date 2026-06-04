import { useNavigate } from "react-router-dom";

export default function SituacionAdministrativaPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 rounded-xl bg-slate-900 px-5 py-2 font-bold text-white"
      >
        ← Volver
      </button>

      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-black text-slate-900">
          Registro de Personal
        </h1>
        <p className="mt-2 text-slate-500">
          Aquí construiremos esta sección.
        </p>
      </div>
    </div>
  );
}