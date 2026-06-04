import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  actualizarPersonal,
  eliminarPersonal,
  obtenerGrados,
  obtenerPersonal,
  obtenerRegistroCompleto,
  registrarPersonalCompleto,
  subirFotoPersonal,
  type RegistroPersonalCompleto,
} from "../services/personalService";

const API_BASE = "http://localhost:5038";

export default function RegistroPersonalPage() {
  const navigate = useNavigate();

  const [grados, setGrados] = useState<any[]>([]);
  const [personal, setPersonal] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [form, setForm] = useState<RegistroPersonalCompleto>({
    genero: "Masculino",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [gradosData, personalData] = await Promise.all([
      obtenerGrados(),
      obtenerPersonal(),
    ]);

    setGrados(gradosData);
    setPersonal(personalData);
  };

  const personalFiltrado = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) return personal;

    return personal.filter((p) => {
      const nombreCompleto =
        `${p.primerNombre || ""} ${p.segundoNombre || ""} ${
          p.apPaterno || ""
        } ${p.apMaterno || ""}`.toLowerCase();

      return (
        nombreCompleto.includes(texto) ||
        (p.ci || "").toLowerCase().includes(texto) ||
        (p.escalafon || "").toLowerCase().includes(texto)
      );
    });
  }, [busqueda, personal]);

  const ultimosTres = personal.slice(0, 3);
  const listaVisible = busqueda ? personalFiltrado : ultimosTres;

  const setValue = (name: keyof RegistroPersonalCompleto, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setForm({ genero: "Masculino" });
    setEditandoId(null);
    setBusqueda("");
  };

  const validarFormulario = () => {
    if (!form.ci?.trim()) {
      Swal.fire("Campo obligatorio", "Debe ingresar el C.I.", "warning");
      return false;
    }

    if (!form.primerNombre?.trim()) {
      Swal.fire(
        "Campo obligatorio",
        "Debe ingresar el primer nombre.",
        "warning",
      );
      return false;
    }

    if (!form.apPaterno?.trim()) {
      Swal.fire(
        "Campo obligatorio",
        "Debe ingresar el apellido paterno.",
        "warning",
      );
      return false;
    }

    if (!form.gradoId) {
      Swal.fire("Campo obligatorio", "Debe seleccionar el grado.", "warning");
      return false;
    }

    return true;
  };

  const guardar = async () => {
    if (!validarFormulario()) return;

    try {
      setLoading(true);

      const payload = {
        ...form,
        gradoId: form.gradoId ? Number(form.gradoId) : null,
        pesoKg: form.pesoKg ? Number(form.pesoKg) : null,
        alturaCm: form.alturaCm ? Number(form.alturaCm) : null,
      };

      if (editandoId) {
        await actualizarPersonal(editandoId, payload);

        await Swal.fire({
          icon: "success",
          title: "Registro actualizado",
          text: "Los datos del efectivo fueron modificados.",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        await registrarPersonalCompleto(payload);

        await Swal.fire({
          icon: "success",
          title: "Registro guardado",
          text: "El efectivo policial fue registrado correctamente.",
          timer: 1400,
          showConfirmButton: false,
        });
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (error: any) {
      const mensaje =
        error?.response?.data?.message ||
        "No se pudo guardar el registro del efectivo policial.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje,
      });
    } finally {
      setLoading(false);
    }
  };

  const cargarParaEditar = async (p: any) => {
    try {
      const data = await obtenerRegistroCompleto(p.id);

      setEditandoId(data.id);

      setForm({
        id: data.id,
        escalafon: data.escalafon || "",
        primerNombre: data.primerNombre || "",
        segundoNombre: data.segundoNombre || "",
        apPaterno: data.apPaterno || "",
        apMaterno: data.apMaterno || "",
        apEsposo: data.apEsposo || "",
        gradoId: data.gradoId || null,
        ci: data.ci || "",
        exp: data.exp || "",
        genero: data.genero || "Masculino",
        alturaCm: data.alturaCm || null,
        pesoKg: data.pesoKg || null,
        fotoUrl: data.fotoUrl || "",
        grupoSanguineo: data.grupoSanguineo || "",
      });

      setBusqueda("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      Swal.fire("Error", "No se pudo cargar el registro.", "error");
    }
  };

  const eliminar = async (id: string) => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar registro?",
      text: "El efectivo será retirado de la lista.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmacion.isConfirmed) return;

    await eliminarPersonal(id);

    await Swal.fire({
      icon: "success",
      title: "Eliminado",
      text: "Registro eliminado correctamente.",
      timer: 1200,
      showConfirmButton: false,
    });

    await cargarDatos();
  };

  const subirFoto = async (file: File) => {
    try {
      const data = await subirFotoPersonal(file);
      setValue("fotoUrl", data.url);

      Swal.fire({
        icon: "success",
        title: "Foto cargada",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire("Error", "No se pudo subir la fotografía.", "error");
    }
  };

  const input =
    "w-full rounded-full bg-[#f3f7c8] px-4 py-3 text-slate-800 outline-none ring-1 ring-lime-100 focus:ring-2 focus:ring-lime-500";

  const label =
    "rounded-full bg-[#87a20c] px-5 py-2 text-center text-sm font-black text-white shadow";

  return (
    <div className="min-h-screen bg-[#f5f8df] p-5 text-[#243300]">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black">Registro de Personal</h1>
          <p className="text-sm text-slate-500">
            {editandoId ? "Modo edición" : "Modo registro"}
          </p>
        </div>

        <div className="relative flex flex-col gap-3 md:flex-row">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por CI, escalafón o nombre..."
            className="w-full rounded-full border border-lime-300 bg-white px-5 py-2 outline-none md:w-[430px]"
          />

          {busqueda && personalFiltrado.length > 0 && (
            <div className="absolute left-0 top-12 z-50 w-full max-w-[430px] rounded-2xl bg-white shadow-xl">
              {personalFiltrado.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => cargarParaEditar(p)}
                  className="block w-full border-b px-5 py-3 text-left hover:bg-lime-50"
                >
                  <p className="font-bold">
                    {p.primerNombre} {p.apPaterno} {p.apMaterno}
                  </p>
                  <p className="text-sm text-slate-500">
                    C.I.: {p.ci} · Esc.: {p.escalafon}
                  </p>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={limpiarFormulario}
            className="rounded-full bg-white px-5 py-2 font-bold shadow"
          >
            + Nuevo
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-full bg-slate-900 px-5 py-2 font-bold text-white"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-8 shadow-xl">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[300px_1fr_340px]">
          <div className="flex flex-col">
            <div className="h-[420px] w-full overflow-hidden rounded-[2rem] border-4 border-lime-500 bg-slate-200 shadow-inner">
              {form.fotoUrl ? (
                <img
                  src={`${API_BASE}${form.fotoUrl}`}
                  alt="Foto del efectivo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  Foto del efectivo
                </div>
              )}
            </div>

            <label className="mx-auto mt-4 cursor-pointer rounded-full bg-lime-500 px-8 py-3 text-sm font-black text-white shadow-lg hover:bg-lime-600">
               Subir / Cambiar foto
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) subirFoto(file);
                }}
              />
            </label>

            <button
              onClick={guardar}
              disabled={loading}
              className="mt-8 w-full rounded-full bg-lime-500 py-4 text-lg font-black text-white shadow-lg hover:bg-lime-600 disabled:opacity-60"
            >
              {loading ? "Guardando..." : editandoId ? "Modificar" : "Añadir"}
            </button>
          </div>

          <div className="grid grid-cols-[135px_1fr] gap-4">
            <div className={label}>N° Escalafón</div>
            <input
              className={input}
              value={form.escalafon || ""}
              onChange={(e) => setValue("escalafon", e.target.value)}
            />

            <div className={label}>Ap. Paterno</div>
            <input
              className={input}
              value={form.apPaterno || ""}
              onChange={(e) => setValue("apPaterno", e.target.value)}
            />

            <div className={label}>Ap. Materno</div>
            <input
              className={input}
              value={form.apMaterno || ""}
              onChange={(e) => setValue("apMaterno", e.target.value)}
            />

            <div className={label}>Ap. Esposo</div>
            <input
              className={input}
              value={form.apEsposo || ""}
              onChange={(e) => setValue("apEsposo", e.target.value)}
            />

            <div className={label}>1er. Nombre</div>
            <input
              className={input}
              value={form.primerNombre || ""}
              onChange={(e) => setValue("primerNombre", e.target.value)}
            />

            <div className={label}>2do. Nombre</div>
            <input
              className={input}
              value={form.segundoNombre || ""}
              onChange={(e) => setValue("segundoNombre", e.target.value)}
            />

            <div className={label}>Grado</div>
            <select
              className={input}
              value={form.gradoId || ""}
              onChange={(e) => setValue("gradoId", e.target.value)}
            >
              <option value="">Seleccione grado...</option>

              <optgroup label="Generales">
                {grados
                  .filter((g) => g.nombre.includes("General"))
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
              </optgroup>

              <optgroup label="Jefes y Oficiales">
                {grados
                  .filter((g) =>
                    [
                      "Coronel",
                      "Teniente Coronel",
                      "Mayor",
                      "Capitán",
                      "Teniente",
                      "Subteniente",
                    ].includes(g.nombre),
                  )
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
              </optgroup>

              <optgroup label="Suboficiales">
                {grados
                  .filter((g) => g.nombre.includes("Suboficial"))
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
              </optgroup>

              <optgroup label="Sargentos">
                {grados
                  .filter(
                    (g) =>
                      g.nombre.includes("Sargento") &&
                      !g.nombre.includes("Servicios"),
                  )
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
              </optgroup>

              <optgroup label="Personal de Servicios">
                {grados
                  .filter((g) => g.nombre.includes("Servicios"))
                  .map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
              </optgroup>
            </select>

            <div className={label}>C.I.</div>
            <div className="grid grid-cols-[1fr_90px] gap-2">
              <input
                className={input}
                value={form.ci || ""}
                onChange={(e) => setValue("ci", e.target.value)}
              />
              <select
                className={input}
                value={form.exp || ""}
                onChange={(e) => setValue("exp", e.target.value)}
              >
                <option value="">Exp.</option>
                <option value="LP">LP</option>
                <option value="CBBA">CBBA</option>
                <option value="SCZ">SCZ</option>
                <option value="OR">OR</option>
                <option value="PT">PT</option>
                <option value="CH">CH</option>
                <option value="TJ">TJ</option>
                <option value="BN">BN</option>
                <option value="PD">PD</option>
              </select>{" "}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-[#f3f7c8] p-8 text-center shadow-inner">
              <div className="mb-4 flex items-center justify-center gap-10 text-6xl">
                <span>♂</span>
                <span className="text-slate-400">|</span>
                <span>♀</span>
              </div>

              <div className={label}>Género</div>

              <div className="mt-4 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setValue("genero", "Masculino")}
                  className={`rounded-full px-4 py-2 font-bold ${
                    form.genero === "Masculino"
                      ? "bg-lime-600 text-white"
                      : "bg-white"
                  }`}
                >
                  M
                </button>

                <button
                  type="button"
                  onClick={() => setValue("genero", "Femenino")}
                  className={`rounded-full px-4 py-2 font-bold ${
                    form.genero === "Femenino"
                      ? "bg-lime-600 text-white"
                      : "bg-white"
                  }`}
                >
                  F
                </button>
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div className={label}>Peso</div>
              <input
                className={input}
                type="number"
                value={form.pesoKg || ""}
                onChange={(e) => setValue("pesoKg", e.target.value)}
              />

              <div className={label}>Altura</div>
              <input
                className={input}
                type="number"
                value={form.alturaCm || ""}
                onChange={(e) => setValue("alturaCm", e.target.value)}
              />

              <div className={label}>Tipo sangre</div>
              <input
                className={input}
                placeholder="Ej: O+, A-, AB+"
                value={form.grupoSanguineo || ""}
                onChange={(e) => setValue("grupoSanguineo", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-black">
          {busqueda ? "Resultados de búsqueda" : "Últimos ingresos de personal"}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-lime-600 text-white">
                <th className="p-3">Foto</th>
                <th className="p-3">Escalafón</th>
                <th className="p-3">C.I.</th>
                <th className="p-3">Nombre completo</th>
                <th className="p-3">Grado</th>
                <th className="p-3">Género</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {listaVisible.map((p) => (
                <tr key={p.id} className="border-b hover:bg-lime-50">
                  <td className="p-3">
                    {p.fotoUrl ? (
                      <img
                        src={`${API_BASE}${p.fotoUrl}`}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-slate-200" />
                    )}
                  </td>

                  <td className="p-3">{p.escalafon}</td>
                  <td className="p-3">{p.ci}</td>
                  <td className="p-3">
                    {p.primerNombre} {p.segundoNombre} {p.apPaterno}{" "}
                    {p.apMaterno}
                  </td>
                  <td className="p-3">{p.grado}</td>
                  <td className="p-3">{p.genero}</td>

                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => cargarParaEditar(p)}
                        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminar(p.id)}
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {listaVisible.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    No se encontraron registros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
