import {
  Award,
  Building2,
  ClipboardList,
  FileText,
  Gavel,
  IdCard,
  Inbox,
  LogOut,
  Newspaper,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Registro de Personal",
    description: "Alta, edición y búsqueda del personal.",
    path: "/registro-personal",
    icon: UserPlus,
  },
  {
    title: "Datos Personales",
    description: "Información familiar, contacto y datos complementarios.",
    path: "/datos-personales",
    icon: IdCard,
  },
  {
    title: "Situación Administrativa",
    description: "Destinos, asignaciones, situaciones y bajas.",
    path: "/situacion-administrativa",
    icon: ClipboardList,
  },
  {
    title: "Méritos / Deméritos",
    description: "Felicitaciones, sanciones y llamadas de atención.",
    path: "/meritos-demeritos",
    icon: Award,
  },
  {
    title: "Lista de Revistas",
    description: "Control y consulta de revistas institucionales.",
    path: "/lista-revistas",
    icon: Newspaper,
  },
  {
    title: "Recepción y Despacho",
    description: "Correspondencia, ingreso y salida documental.",
    path: "/recepcion-despacho",
    icon: Inbox,
  },
  {
    title: "Revisión Jurídica",
    description: "Seguimiento de documentos en revisión legal.",
    path: "/revision-juridica",
    icon: Gavel,
  },
  {
    title: "Instituciones",
    description: "Administración de unidades e instituciones.",
    path: "/instituciones",
    icon: Building2,
  },
  {
    title: "Reportes",
    description: "Generación de informes y estadísticas.",
    path: "/reportes",
    icon: FileText,
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Usuario";

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#354711]">
      <header className="border-b border-lime-700/40 bg-slate-950/90 px-8 py-5 text-white shadow-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-wide">
              SISTEMA DE RECURSOS HUMANOS
            </h1>
            <p className="text-sm text-slate-300">
              Policía Boliviana · Comando Departamental Cochabamba
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-sm text-slate-300">Usuario activo</p>
              <p className="font-bold text-lime-400">{username}</p>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold shadow-lg transition hover:bg-red-700"
            >
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-10">
        <section className="mb-10 rounded-3xl border border-white/10 bg-white/90 p-8 shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-lime-700">
            Menú principal
          </p>
          <h2 className="mt-3 text-4xl font-black text-slate-900">
            Panel de Gestión Institucional
          </h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            Seleccione un área para administrar la información correspondiente
            del personal, documentos, instituciones y reportes.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="group rounded-3xl border border-white/20 bg-white p-6 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-100 text-lime-700 transition group-hover:bg-lime-600 group-hover:text-white">
                  <Icon size={34} />
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-6 text-sm font-bold text-lime-700">
                  Ingresar →
                </div>
              </button>
            );
          })}
        </section>
      </main>
    </div>
  );
}