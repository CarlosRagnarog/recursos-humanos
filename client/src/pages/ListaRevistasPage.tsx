import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  obtenerPersonal,
  obtenerRegistroCompleto,
} from "../services/personalService";
import {
  crearRevista,
  eliminarRevista,
  modificarRevista,
  obtenerRevistas,
  type Revista,
} from "../services/revistasService";

const API_BASE = "http://localhost:5038";

export default function ListaRevistasPage() {
  const navigate = useNavigate();

  const [personal, setPersonal] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<any>(null);
  const [personalId, setPersonalId] = useState<string | null>(null);

  const [revistas, setRevistas] = useState<Revista[]>([]);
  const [revistaSeleccionada, setRevistaSeleccionada] =
    useState<Revista | null>(null);

  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [nombre, setNombre] = useState("");
  const [informacion, setInformacion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const dias =
    fechaInicio && fechaFin
      ? Math.max(
          0,
          Math.ceil(
            (new Date(fechaFin).getTime() -
              new Date(fechaInicio).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  useEffect(() => {
    obtenerPersonal().then(setPersonal);
  }, []);

  const resultados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) return [];

    return personal.filter((p) => {
      const nombreCompleto = `${p.primerNombre || ""} ${p.segundoNombre || ""} ${
        p.apPaterno || ""
      } ${p.apMaterno || ""}`.toLowerCase();

      return (
        nombreCompleto.includes(texto) ||
        (p.ci || "").toLowerCase().includes(texto) ||
        (p.escalafon || "").toLowerCase().includes(texto)
      );
    });
  }, [busqueda, personal]);

  const seleccionarPersonal = async (p: any) => {
    try {
      const data = await obtenerRegistroCompleto(p.id);

      setSeleccionado(data);
      setPersonalId(data.id);
      setBusqueda("");
      setMostrarPanel(false);
      limpiarFormulario();

      await cargarRevistas(data.id);
    } catch {
      Swal.fire("Error", "No se pudo cargar el efectivo.", "error");
    }
  };

  const cargarRevistas = async (id: string) => {
    const data = await obtenerRevistas(id);
    setRevistas(data);
  };

  const limpiarFormulario = () => {
    setRevistaSeleccionada(null);
    setNombre("");
    setInformacion("");
    setFechaInicio("");
    setFechaFin("");
    setArchivo(null);
  };

  const abrirNuevo = () => {
    if (!personalId) {
      Swal.fire("Seleccione personal", "Primero debe seleccionar un efectivo.", "warning");
      return;
    }

    limpiarFormulario();
    setMostrarPanel(true);
  };

  const abrirModificar = (revista: Revista) => {
    setRevistaSeleccionada(revista);
    setNombre(revista.nombre || "");
    setInformacion(revista.informacion || "");
    setFechaInicio((revista as any).fechaInicio || "");
    setFechaFin((revista as any).fechaFin || "");
    setArchivo(null);
    setMostrarPanel(true);
  };

  const guardar = async () => {
    if (!personalId) {
      Swal.fire("Seleccione personal", "Debe seleccionar un efectivo.", "warning");
      return;
    }

    if (!nombre.trim()) {
      Swal.fire("Campo obligatorio", "Debe ingresar el nombre del documento.", "warning");
      return;
    }

    if (!fechaInicio || !fechaFin) {
      Swal.fire("Campo obligatorio", "Debe ingresar fecha inicio y fecha fin.", "warning");
      return;
    }

    if (!revistaSeleccionada && !archivo) {
      Swal.fire("Archivo obligatorio", "Debe seleccionar un archivo.", "warning");
      return;
    }

    try {
      setLoading(true);

      const informacionCompleta = JSON.stringify({
        informacion,
        fechaInicio,
        fechaFin,
        dias,
      });

      if (revistaSeleccionada) {
        await modificarRevista(
          revistaSeleccionada.id,
          nombre,
          informacionCompleta,
          archivo
        );

        await Swal.fire({
          icon: "success",
          title: "Documento modificado",
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        await crearRevista(personalId, nombre, informacionCompleta, archivo!);

        await Swal.fire({
          icon: "success",
          title: "Documento añadido",
          timer: 1200,
          showConfirmButton: false,
        });
      }

      limpiarFormulario();
      setMostrarPanel(false);
      await cargarRevistas(personalId);
    } catch {
      Swal.fire("Error", "No se pudo guardar el documento.", "error");
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (revista: Revista) => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar documento?",
      text: "Esta acción eliminará el registro seleccionado.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmacion.isConfirmed) return;

    await eliminarRevista(revista.id);

    await Swal.fire({
      icon: "success",
      title: "Documento eliminado",
      timer: 1200,
      showConfirmButton: false,
    });

    if (personalId) await cargarRevistas(personalId);
  };

  const leerInfo = (valor?: string) => {
    if (!valor) {
      return {
        informacion: "",
        fechaInicio: "",
        fechaFin: "",
        dias: 0,
      };
    }

    try {
      return JSON.parse(valor);
    } catch {
      return {
        informacion: valor,
        fechaInicio: "",
        fechaFin: "",
        dias: 0,
      };
    }
  };

  const input =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-lime-500";

  const getIconoArchivo = (url?: string) => {
    if (!url) return "📄";
    const extension = url.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "webp"].includes(extension || "")) return "🖼️";
    if (["pdf"].includes(extension || "")) return "📕";
    if (["doc", "docx"].includes(extension || "")) return "📘";
    if (["xls", "xlsx", "csv"].includes(extension || "")) return "📗";

    return "📄";
  };

  return (
    <div className="min-h-screen bg-[#f5f8df] p-5 text-[#243300]">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black">Lista de Revistas</h1>
          <p className="text-sm text-slate-500">
            Registro documental del efectivo policial.
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
            placeholder="Buscar por escalafón, C.I., nombre o apellido..."
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
                    {p.grado} - {p.primerNombre} {p.segundoNombre}{" "}
                    {p.apPaterno} {p.apMaterno}
                  </p>
                  <p className="text-sm text-slate-500">
                    Esc.: {p.escalafon} · C.I.: {p.ci}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {seleccionado && (
          <div className="mt-5 grid grid-cols-1 gap-4 rounded-2xl bg-[#f3f7c8] p-5 md:grid-cols-4">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Grado</p>
              <p className="text-lg font-black">{seleccionado.grado}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Nombre</p>
              <p className="text-lg font-black">
                {seleccionado.primerNombre} {seleccionado.apPaterno}{" "}
                {seleccionado.apMaterno}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-500">C.I.</p>
              <p className="text-lg font-black">
                {seleccionado.ci} {seleccionado.exp}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-500">
                Escalafón
              </p>
              <p className="text-lg font-black">{seleccionado.escalafon}</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-xl">
        <div className="rounded-[2rem] border border-lime-200 bg-[#fbfde9] p-6 shadow-inner">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black">Documentos de Revista</h2>

            <div className="flex gap-3">
              <button
                onClick={abrirNuevo}
                disabled={!personalId}
                className="rounded-full bg-lime-500 px-7 py-2 font-black text-white shadow disabled:opacity-60"
              >
                Añadir
              </button>

              {mostrarPanel && (
                <button
                  onClick={() => {
                    setMostrarPanel(false);
                    limpiarFormulario();
                  }}
                  className="rounded-full bg-slate-500 px-7 py-2 font-black text-white shadow"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {mostrarPanel && (
            <div className="mb-6 rounded-[2rem] border border-lime-200 bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-black">
                {revistaSeleccionada ? "Modificar documento" : "Añadir documento"}
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <label className="mb-2 block font-bold">
                    Nombre del documento
                  </label>
                  <input
                    className={input}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Revista mensual, informe, respaldo..."
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">
                    Fecha inicio
                  </label>
                  <input
                    className={input}
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">
                    Fecha fin
                  </label>
                  <input
                    className={input}
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold">
                    Días
                  </label>
                  <input
                    className={input}
                    value={dias}
                    readOnly
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="mb-2 block font-bold">
                    Archivo
                  </label>
                  <input
                    className={input}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setArchivo(file);
                    }}
                  />
                  {revistaSeleccionada && (
                    <p className="mt-1 text-xs text-slate-500">
                      Puede dejar vacío si no desea cambiar el archivo.
                    </p>
                  )}
                </div>

                <div className="md:col-span-4">
                  <label className="mb-2 block font-bold">
                    Información adicional
                  </label>
                  <textarea
                    className="min-h-28 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-lime-500"
                    value={informacion}
                    onChange={(e) => setInformacion(e.target.value)}
                    placeholder="Detalle, observación, referencia, descripción..."
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={guardar}
                  disabled={loading}
                  className="rounded-full bg-lime-500 px-8 py-3 font-black text-white shadow disabled:opacity-60"
                >
                  {loading
                    ? "Guardando..."
                    : revistaSeleccionada
                    ? "Modificar"
                    : "Añadir"}
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-lime-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-[#f3f7c8]">
                <tr>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Inicio</th>
                  <th className="p-3">Fin</th>
                  <th className="p-3">Días</th>
                  <th className="p-3">Información adicional</th>
                  <th className="p-3">Fecha registro</th>
                  <th className="p-3 text-center">Archivo</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {revistas.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-slate-400">
                      No hay revistas registradas. Use el botón Añadir para cargar una nueva.
                    </td>
                  </tr>
                ) : (
                  revistas.map((r) => {
                    const info = leerInfo(r.informacion);

                    return (
                      <tr key={r.id} className="border-t hover:bg-lime-50">
                        <td className="p-3 text-2xl">
                          {getIconoArchivo(r.archivoUrl)}
                        </td>
                        <td className="p-3 font-bold">{r.nombre}</td>
                        <td className="p-3">{info.fechaInicio || "-"}</td>
                        <td className="p-3">{info.fechaFin || "-"}</td>
                        <td className="p-3">{info.dias || "-"}</td>
                        <td className="p-3">{info.informacion || "-"}</td>
                        <td className="p-3">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-3 text-center">
                          {r.archivoUrl ? (
                            <a
                              href={`${API_BASE}${r.archivoUrl}`}
                              target="_blank"
                              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white"
                            >
                              Ver
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => abrirModificar(r)}
                              className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-800"
                            >
                              Modificar
                            </button>

                            <button
                              onClick={() => eliminar(r)}
                              className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!personalId && (
            <div className="mt-6 rounded-2xl bg-white p-5 text-slate-700 shadow">
              Selecciona un oficial en el buscador para ver este panel.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}