import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  crearCorrespondencia,
  eliminarCorrespondencia,
  modificarCorrespondencia,
  obtenerCorrespondencias,
  type Correspondencia,
} from "../services/correspondenciaService";

export default function RecepcionDespachoPage() {
  const navigate = useNavigate();

  const [lista, setLista] = useState<Correspondencia[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Correspondencia | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Correspondencia>({
    tipo: "",
    fechaHora: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const data = await obtenerCorrespondencias();
    setLista(data);
  };

  const setValue = (name: keyof Correspondencia, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarForm = () => {
    setForm({
      tipo: "",
      fechaHora: new Date().toISOString().slice(0, 16),
    });
    setEditando(null);
  };

  const abrirNuevo = () => {
    limpiarForm();
    setModal(true);
  };

  const abrirEditar = (item: Correspondencia) => {
    setEditando(item);
    setForm({
      ...item,
      fechaHora: item.fechaHora ? item.fechaHora.slice(0, 16) : "",
    });
    setModal(true);
  };

  const registrosFiltrados = useMemo(() => {
    return lista.filter((x) => {
      const texto = busqueda.toLowerCase();

      const coincideTexto =
        !texto ||
        `${x.codigoRegistro || ""} ${x.origen || ""} ${x.remitente || ""} ${
          x.referencia || ""
        } ${x.nroOficio || ""}`
          .toLowerCase()
          .includes(texto);

      const coincideTipo = !tipoFiltro || x.tipo === tipoFiltro;

      const fecha = x.fechaHora ? x.fechaHora.slice(0, 10) : "";

      const coincideDesde = !desde || fecha >= desde;
      const coincideHasta = !hasta || fecha <= hasta;

      return coincideTexto && coincideTipo && coincideDesde && coincideHasta;
    });
  }, [lista, busqueda, tipoFiltro, desde, hasta]);

  const total = lista.length;
  const entradas = lista.filter((x) => x.tipo === "Entrada").length;
  const salidas = lista.filter((x) => x.tipo === "Salida").length;
  const internas = lista.filter((x) => x.tipo === "Interna").length;

  const guardar = async () => {
    if (!form.tipo) {
      Swal.fire("Campo obligatorio", "Seleccione el tipo.", "warning");
      return;
    }

    if (!form.codigoRegistro?.trim()) {
      Swal.fire("Campo obligatorio", "Ingrese el código de registro.", "warning");
      return;
    }

    try {
      setLoading(true);

      if (editando?.id) {
        await modificarCorrespondencia(editando.id, form);

        await Swal.fire({
          icon: "success",
          title: "Registro modificado",
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        await crearCorrespondencia(form);

        await Swal.fire({
          icon: "success",
          title: "Registro añadido",
          timer: 1200,
          showConfirmButton: false,
        });
      }

      setModal(false);
      limpiarForm();
      await cargar();
    } catch {
      Swal.fire("Error", "No se pudo guardar el registro.", "error");
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (item: Correspondencia) => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar registro?",
      text: "Esta acción eliminará la correspondencia seleccionada.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmacion.isConfirmed || !item.id) return;

    await eliminarCorrespondencia(item.id);

    await Swal.fire({
      icon: "success",
      title: "Registro eliminado",
      timer: 1200,
      showConfirmButton: false,
    });

    await cargar();
  };

  const input =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-lime-500";

  return (
    <div className="min-h-screen bg-[#f5f8df] p-7 text-[#243300]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">RECEPCIÓN Y DESPACHO</h1>
          <p className="text-slate-600">
            Gestión de la correspondencia recibida y despachada.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-full bg-slate-900 px-6 py-2 font-bold text-white"
        >
          Volver
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-lime-400 bg-white p-4">
          <p className="text-sm text-slate-500">Total registros</p>
          <p className="text-3xl font-black">{total}</p>
        </div>

        <div className="rounded-xl border border-green-300 bg-green-50 p-4">
          <p className="text-sm text-slate-500">Entradas</p>
          <p className="text-3xl font-black text-green-700">{entradas}</p>
        </div>

        <div className="rounded-xl border border-red-300 bg-red-50 p-4">
          <p className="text-sm text-slate-500">Salidas</p>
          <p className="text-3xl font-black text-red-700">{salidas}</p>
        </div>

        <div className="rounded-xl border border-blue-300 bg-blue-50 p-4">
          <p className="text-sm text-slate-500">Internas</p>
          <p className="text-3xl font-black text-blue-700">{internas}</p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por referencia, origen, remitente..."
          className="rounded-full border border-lime-400 bg-white px-5 py-3 outline-none"
        />

        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          className="rounded-full border border-lime-400 bg-white px-5 py-3 outline-none"
        >
          <option value="">Todos los tipos</option>
          <option value="Entrada">Entradas</option>
          <option value="Salida">Salidas</option>
          <option value="Interna">Internas</option>
        </select>

        <input
          type="date"
          value={desde}
          onChange={(e) => setDesde(e.target.value)}
          className="rounded-full border border-lime-400 bg-white px-5 py-3 outline-none"
        />

        <input
          type="date"
          value={hasta}
          onChange={(e) => setHasta(e.target.value)}
          className="rounded-full border border-lime-400 bg-white px-5 py-3 outline-none"
        />

        <button className="rounded-full bg-lime-700 px-6 py-3 font-black text-white">
          Buscar
        </button>

        <button
          onClick={() => {
            setBusqueda("");
            setTipoFiltro("");
            setDesde("");
            setHasta("");
          }}
          className="rounded-full border border-lime-700 px-6 py-3 font-black text-lime-700"
        >
          Limpiar
        </button>

        <button
          onClick={abrirNuevo}
          className="ml-auto rounded-full bg-lime-600 px-7 py-3 font-black text-white"
        >
          Añadir
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-lime-400 bg-white">
        <table className="w-full text-left">
          <thead className="bg-lime-700 text-white">
            <tr>
              <th className="p-3">N°</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Código N° de Registro</th>
              <th className="p-3">Origen</th>
              <th className="p-3">N° de Oficio</th>
              <th className="p-3">Referencia</th>
              <th className="p-3">Remitente</th>
              <th className="p-3">Sección</th>
              <th className="p-3">Fecha / Hora</th>
              <th className="p-3">Firma</th>
              <th className="p-3">Tiempo respuesta</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {registrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={12} className="p-10 text-center text-slate-500">
                  No hay registros todavía.
                </td>
              </tr>
            ) : (
              registrosFiltrados.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-lime-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.tipo}</td>
                  <td className="p-3">{item.codigoRegistro}</td>
                  <td className="p-3">{item.origen}</td>
                  <td className="p-3">{item.nroOficio}</td>
                  <td className="p-3">{item.referencia}</td>
                  <td className="p-3">{item.remitente}</td>
                  <td className="p-3">{item.seccion}</td>
                  <td className="p-3">
                    {item.fechaHora
                      ? new Date(item.fechaHora).toLocaleString()
                      : "-"}
                  </td>
                  <td className="p-3">{item.firma}</td>
                  <td className="p-3">{item.tiempoRespuesta}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirEditar(item)}
                        className="rounded-full bg-yellow-400 px-3 py-1 text-sm font-bold"
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => eliminar(item)}
                        className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-5xl rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-lime-800">
                {editando ? "Modificar correspondencia" : "Nueva correspondencia"}
              </h2>

              <button
                onClick={() => {
                  setModal(false);
                  limpiarForm();
                }}
                className="rounded-full border px-5 py-2"
              >
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block font-bold">Tipo</label>
                <select
                  className={input}
                  value={form.tipo || ""}
                  onChange={(e) => setValue("tipo", e.target.value)}
                >
                  <option value="">Selecciona...</option>
                  <option value="Entrada">Entrada</option>
                  <option value="Salida">Salida</option>
                  <option value="Interna">Interna</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-bold">Código N° de Registro</label>
                <input
                  className={input}
                  value={form.codigoRegistro || ""}
                  onChange={(e) => setValue("codigoRegistro", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block font-bold">N° de Oficio</label>
                <input
                  className={input}
                  value={form.nroOficio || ""}
                  onChange={(e) => setValue("nroOficio", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block font-bold">Origen</label>
                <input
                  className={input}
                  value={form.origen || ""}
                  onChange={(e) => setValue("origen", e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block font-bold">Referencia</label>
                <input
                  className={input}
                  value={form.referencia || ""}
                  onChange={(e) => setValue("referencia", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block font-bold">Remitente</label>
                <input
                  className={input}
                  value={form.remitente || ""}
                  onChange={(e) => setValue("remitente", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block font-bold">Sección</label>
                <input
                  className={input}
                  value={form.seccion || ""}
                  onChange={(e) => setValue("seccion", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block font-bold">Fecha / Hora</label>
                <input
                  className={input}
                  type="datetime-local"
                  value={form.fechaHora || ""}
                  onChange={(e) => setValue("fechaHora", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block font-bold">Firma</label>
                <input
                  className={input}
                  value={form.firma || ""}
                  onChange={(e) => setValue("firma", e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block font-bold">Tiempo de respuesta</label>
                <input
                  className={input}
                  value={form.tiempoRespuesta || ""}
                  onChange={(e) => setValue("tiempoRespuesta", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => {
                  setModal(false);
                  limpiarForm();
                }}
                className="rounded-full border px-7 py-3 font-bold"
              >
                Cancelar
              </button>

              <button
                onClick={guardar}
                disabled={loading}
                className="rounded-full bg-lime-700 px-7 py-3 font-black text-white disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}