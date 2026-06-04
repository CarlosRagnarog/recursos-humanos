import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { login } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@rrhh.com");
  const [password, setPassword] = useState("Admin123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await login({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);
      localStorage.setItem("roles", JSON.stringify(data.roles));

      await Swal.fire({
        icon: "success",
        title: "Acceso autorizado",
        text: `Bienvenido ${data.username}`,
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Usuario o contraseña incorrectos",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#354711] flex items-center justify-center px-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white/90 shadow-2xl grid grid-cols-1 md:grid-cols-2 border border-white/40">
        
        <section className="relative flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-100 p-12">
          <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-lime-500 via-yellow-400 to-lime-700" />

          <img
            src="/logo-policial.png"
            alt="Policía Boliviana"
            className="w-64 h-64 object-contain drop-shadow-xl"
          />

          <h1 className="mt-6 text-3xl font-black tracking-wide text-slate-900">
            POLICÍA BOLIVIANA
          </h1>

          <p className="mt-2 text-lg font-semibold text-slate-700">
            CDMO. DPTAL. CBBA.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-900 px-6 py-4 text-center shadow-lg">
            <p className="text-xs uppercase tracking-[0.3em] text-lime-400">
              Sistema Institucional
            </p>
            <p className="mt-1 text-white font-bold">
              Recursos Humanos
            </p>
          </div>
        </section>

        <section className="bg-[#d9d9d9] p-10 md:p-14 flex items-center">
          <div className="w-full">
            <div className="mb-10">
              <h2 className="text-4xl font-black text-slate-900">
                Acceso al sistema
              </h2>
              <p className="mt-2 text-slate-600">
                Ingrese sus credenciales institucionales.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-7">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Usuario:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-800 shadow-inner outline-none transition focus:border-lime-600 focus:ring-4 focus:ring-lime-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Contraseña:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-800 shadow-inner outline-none transition focus:border-lime-600 focus:ring-4 focus:ring-lime-200"
                  required
                />
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-64 rounded-full bg-lime-500 py-3 font-black text-white shadow-xl shadow-lime-700/30 transition hover:-translate-y-0.5 hover:bg-lime-600 disabled:opacity-60"
                >
                  {loading ? "VALIDANDO..." : "INGRESAR"}
                </button>
              </div>
            </form>

            <div className="mt-10 border-t border-slate-400 pt-5 text-center">
              <p className="text-xs font-semibold text-slate-600">
                Plataforma segura de gestión administrativa RR.HH.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}