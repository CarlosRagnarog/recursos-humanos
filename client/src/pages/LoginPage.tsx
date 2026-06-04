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
        title: "Bienvenido",
        text: `Hola ${data.username}`,
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error de acceso",
        text: "Correo o contraseña incorrectos",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white">
        <div className="hidden md:flex flex-col justify-center bg-slate-900 p-10 text-white">
          <h1 className="text-4xl font-extrabold leading-tight">
            Recursos Humanos
          </h1>
          <p className="mt-4 text-slate-300">
            Plataforma administrativa para la gestión del personal, documentos,
            destinos, reportes y seguimiento institucional.
          </p>

          <div className="mt-10 rounded-2xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Sistema seguro con JWT</p>
            <p className="mt-2 text-2xl font-bold">RRHH Administrativo</p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
              RH
            </div>
            <h2 className="text-3xl font-bold text-slate-800">
              Iniciar sesión
            </h2>
            <p className="mt-2 text-slate-500">
              Ingrese sus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rrhh.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Contraseña
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar al sistema"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Sistema de Recursos Humanos © 2026
          </p>
        </div>
      </div>
    </div>
  );
}