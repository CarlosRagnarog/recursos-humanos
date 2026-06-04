import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  actualizarDatosComplementarios,
  obtenerPersonal,
  obtenerRegistroCompleto,
  type RegistroPersonalCompleto,
} from "../services/personalService";
function Field({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-2 inline-block rounded-full bg-[#87a20c] px-5 py-2 text-sm font-black text-white shadow">
        {title}
      </div>
      {children}
    </div>
  );
}
export default function DatosPersonalesPage() {
  const navigate = useNavigate();

  const [personal, setPersonal] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [personalId, setPersonalId] = useState<string | null>(null);
  const [seleccionado, setSeleccionado] = useState<any>(null);
  const [tab, setTab] = useState("datos");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<RegistroPersonalCompleto>({});

  useEffect(() => {
    obtenerPersonal().then(setPersonal);
  }, []);

  const resultados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) return [];

    return personal.filter((p) => {
      const nombre = `${p.primerNombre || ""} ${p.segundoNombre || ""} ${
        p.apPaterno || ""
      } ${p.apMaterno || ""}`.toLowerCase();

      return nombre.includes(texto) || (p.ci || "").includes(texto);
    });
  }, [busqueda, personal]);

  const setValue = (name: keyof RegistroPersonalCompleto, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calcularEdad = (fecha?: string) => {
    if (!fecha) return "";
    const nacimiento = new Date(fecha);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad.toString();
  };

  const calcularServicio = (fecha?: string) => {
    if (!fecha) return "";
    const ingreso = new Date(fecha);
    const hoy = new Date();

    let anios = hoy.getFullYear() - ingreso.getFullYear();
    const mes = hoy.getMonth() - ingreso.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < ingreso.getDate())) {
      anios--;
    }

    return anios.toString();
  };

  const seleccionarPersonal = async (p: any) => {
    try {
      const data = await obtenerRegistroCompleto(p.id);

      setPersonalId(data.id);
      setSeleccionado(data);
      setBusqueda("");

      setForm({
        estadoCivil: data.estadoCivil || "",
        fechaNacimiento: data.fechaNacimiento || "",
        grupoSanguineo: data.grupoSanguineo || "",
        fechaIngreso: data.fechaIngreso || "",
        telCel: data.telCel || "",
        telPart: data.telPart || "",
        direccion: data.direccion || "",
        zona: data.zona || "",
        sigep: data.sigep || "",
        email: data.email || "",

        emergenciaNombres: data.emergenciaNombres || "",
        emergenciaApellidos: data.emergenciaApellidos || "",
        emergenciaTelefono: data.emergenciaTelefono || "",
        emergenciaCelular: data.emergenciaCelular || "",
        emergenciaDireccion: data.emergenciaDireccion || "",

        dependienteTipo: data.dependienteTipo || "",
        dependienteNombres: data.dependienteNombres || "",
        dependienteApellidos: data.dependienteApellidos || "",
        dependienteCelular: data.dependienteCelular || "",
        dependienteDireccion: data.dependienteDireccion || "",

        especialidadTexto: data.especialidadTexto || "",
      });
    } catch {
      Swal.fire("Error", "No se pudo cargar el personal.", "error");
    }
  };

  const guardar = async () => {
    if (!personalId) {
      Swal.fire(
        "Seleccione personal",
        "Debe buscar y seleccionar un efectivo.",
        "warning",
      );
      return;
    }

    try {
      setLoading(true);

      await actualizarDatosComplementarios(personalId, form);

      await Swal.fire({
        icon: "success",
        title: "Datos guardados",
        text: "La información fue actualizada correctamente.",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Error", "No se pudieron guardar los datos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full rounded-full bg-[#f3f7c8] px-5 py-3 text-slate-800 outline-none ring-1 ring-lime-100 focus:ring-2 focus:ring-lime-500";

 

  return (
    <div className="min-h-screen bg-[#f5f8df] p-5 text-[#243300]">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black">Datos Personales</h1>
          <p className="text-sm text-slate-500">
            Complete información personal, emergencia, dependientes y
            especialidades.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full bg-slate-900 px-6 py-2 font-bold text-white"
        >
          Volver
        </button>
      </div>

      <div className="mb-6 rounded-[2rem] bg-white p-6 shadow-xl">
        <div className="relative">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar efectivo por C.I. o nombre..."
            className="w-full rounded-full border border-lime-300 bg-white px-6 py-3 outline-none"
          />

          {resultados.length > 0 && (
            <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white shadow-xl">
              {resultados.slice(0, 8).map((p) => (
                <button
                  key={p.id}
                  onClick={() => seleccionarPersonal(p)}
                  className="block w-full border-b px-5 py-3 text-left hover:bg-lime-50"
                >
                  <p className="font-bold">
                    {p.primerNombre} {p.segundoNombre} {p.apPaterno}{" "}
                    {p.apMaterno}
                  </p>
                  <p className="text-sm text-slate-500">
                    Grado: {p.grado} · C.I.: {p.ci}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {seleccionado && (
          <div className="mt-5 grid grid-cols-1 gap-4 rounded-2xl bg-[#f3f7c8] p-5 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">
                Nombre
              </p>
              <p className="text-lg font-black">
                {seleccionado.primerNombre} {seleccionado.segundoNombre}{" "}
                {seleccionado.apPaterno} {seleccionado.apMaterno}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-500">
                Grado
              </p>
              <p className="text-lg font-black">{seleccionado.grado}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-500">C.I.</p>
              <p className="text-lg font-black">
                {seleccionado.ci} {seleccionado.exp}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-xl">
        <div className="mb-5 flex flex-wrap gap-4">
          {[
            ["datos", "Datos personales"],
            ["emergencias", "Emergencias"],
            ["dependientes", "Dependientes"],
            ["especialidades", "Especialidades"],
          ].map(([key, text]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-8 py-3 font-bold ${
                tab === key
                  ? "bg-lime-500 text-white"
                  : "bg-lime-100 text-slate-700"
              }`}
            >
              {text}
            </button>
          ))}
        </div>

        <div className="rounded-[2rem] border border-lime-200 bg-[#fbfde9] p-8 shadow-inner">
          {tab === "datos" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <Field title="Estado civil">
                <select
                  className={input}
                  value={form.estadoCivil || ""}
                  onChange={(e) => setValue("estadoCivil", e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  <option value="Soltero(a)">Soltero(a)</option>
                  <option value="Casado(a)">Casado(a)</option>
                  <option value="Concubino(a)">Concubino(a)</option>
                  <option value="Divorciado(a)">Divorciado(a)</option>
                  <option value="Viudo(a)">Viudo(a)</option>
                  <option value="Separado(a)">Separado(a)</option>
                </select>
              </Field>

              <Field title="Fecha de nacimiento">
                <input
                  className={input}
                  type="date"
                  value={form.fechaNacimiento || ""}
                  onChange={(e) => setValue("fechaNacimiento", e.target.value)}
                />
              </Field>

              <Field title="Edad">
                <input
                  className={input}
                  value={calcularEdad(form.fechaNacimiento)}
                  readOnly
                  placeholder="Auto"
                />
              </Field>

              <Field title="Grupo sanguíneo">
                <input
                  className={input}
                  value={form.grupoSanguineo || ""}
                  onChange={(e) => setValue("grupoSanguineo", e.target.value)}
                />
              </Field>

              <Field title="Fecha de ingreso a la Policía">
                <input
                  className={input}
                  type="date"
                  value={form.fechaIngreso || ""}
                  onChange={(e) => setValue("fechaIngreso", e.target.value)}
                />
              </Field>

              <Field title="Años de servicio">
                <input
                  className={input}
                  value={calcularServicio(form.fechaIngreso)}
                  readOnly
                  placeholder="Auto"
                />
              </Field>

              <Field title="Tél. celular">
                <input
                  className={input}
                  value={form.telCel || ""}
                  onChange={(e) => setValue("telCel", e.target.value)}
                />
              </Field>

              <Field title="Tél. particular">
                <input
                  className={input}
                  value={form.telPart || ""}
                  onChange={(e) => setValue("telPart", e.target.value)}
                />
              </Field>

              <Field title="Dirección actual" className="md:col-span-2">
                <input
                  className={input}
                  value={form.direccion || ""}
                  onChange={(e) => setValue("direccion", e.target.value)}
                />
              </Field>

              <Field title="Zona" className="md:col-span-2">
                <input
                  className={input}
                  value={form.zona || ""}
                  onChange={(e) => setValue("zona", e.target.value)}
                />
              </Field>

              <Field title="SIGEP" className="md:col-span-2">
                <input
                  className={input}
                  value={form.sigep || ""}
                  onChange={(e) => setValue("sigep", e.target.value)}
                />
              </Field>

              <Field title="Correo electrónico" className="md:col-span-2">
                <input
                  className={input}
                  value={form.email || ""}
                  onChange={(e) => setValue("email", e.target.value)}
                />
              </Field>
            </div>
          )}

          {tab === "emergencias" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field title="Nombres">
                <input
                  className={input}
                  value={form.emergenciaNombres || ""}
                  onChange={(e) =>
                    setValue("emergenciaNombres", e.target.value)
                  }
                />
              </Field>

              <Field title="Apellidos">
                <input
                  className={input}
                  value={form.emergenciaApellidos || ""}
                  onChange={(e) =>
                    setValue("emergenciaApellidos", e.target.value)
                  }
                />
              </Field>

              <Field title="Teléfono">
                <input
                  className={input}
                  value={form.emergenciaTelefono || ""}
                  onChange={(e) =>
                    setValue("emergenciaTelefono", e.target.value)
                  }
                />
              </Field>

              <Field title="Celular">
                <input
                  className={input}
                  value={form.emergenciaCelular || ""}
                  onChange={(e) =>
                    setValue("emergenciaCelular", e.target.value)
                  }
                />
              </Field>

              <Field title="Dirección" className="md:col-span-2">
                <input
                  className={input}
                  value={form.emergenciaDireccion || ""}
                  onChange={(e) =>
                    setValue("emergenciaDireccion", e.target.value)
                  }
                />
              </Field>
            </div>
          )}

          {tab === "dependientes" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Field title="Tipo">
                <input
                  className={input}
                  placeholder="Esposa, Hijo, Pariente..."
                  value={form.dependienteTipo || ""}
                  onChange={(e) => setValue("dependienteTipo", e.target.value)}
                />
              </Field>

              <Field title="Nombres">
                <input
                  className={input}
                  value={form.dependienteNombres || ""}
                  onChange={(e) =>
                    setValue("dependienteNombres", e.target.value)
                  }
                />
              </Field>

              <Field title="Apellidos">
                <input
                  className={input}
                  value={form.dependienteApellidos || ""}
                  onChange={(e) =>
                    setValue("dependienteApellidos", e.target.value)
                  }
                />
              </Field>

              <Field title="Celular">
                <input
                  className={input}
                  value={form.dependienteCelular || ""}
                  onChange={(e) =>
                    setValue("dependienteCelular", e.target.value)
                  }
                />
              </Field>

              <Field title="Dirección" className="md:col-span-2">
                <input
                  className={input}
                  value={form.dependienteDireccion || ""}
                  onChange={(e) =>
                    setValue("dependienteDireccion", e.target.value)
                  }
                />
              </Field>
            </div>
          )}

          {tab === "especialidades" && (
            <Field title="Especialidades del efectivo">
              <textarea
                className="h-44 w-full rounded-[2rem] bg-[#f3f7c8] p-6 outline-none ring-1 ring-lime-100 focus:ring-2 focus:ring-lime-500"
                placeholder="Escribe en qué se especializa el oficial."
                value={form.especialidadTexto || ""}
                onChange={(e) => setValue("especialidadTexto", e.target.value)}
              />
            </Field>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-4">
          <button
            onClick={() => {
              setForm({});
              setSeleccionado(null);
              setPersonalId(null);
              setBusqueda("");
              setTab("datos");
            }}
            className="rounded-full bg-slate-500 px-10 py-3 font-black text-white shadow-lg hover:bg-slate-600"
          >
            Limpiar
          </button>

          <button
            onClick={guardar}
            disabled={loading || !personalId}
            className="rounded-full bg-lime-500 px-10 py-3 font-black text-white shadow-lg hover:bg-lime-600 disabled:opacity-60"
          >
            {loading ? "Modificando..." : "Modificar"}
          </button>
        </div>
      </div>
    </div>
  );
}
