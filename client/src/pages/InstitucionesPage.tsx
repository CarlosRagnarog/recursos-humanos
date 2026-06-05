import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  crearInstitucion,
  eliminarInstitucion,
  modificarInstitucion,
  obtenerInstituciones,
  type Institucion,
} from "../services/institucionesService";

export default function InstitucionesPage() {
  const navigate = useNavigate();

  const [lista, setLista] = useState<Institucion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Institucion | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Institucion>({
    nombre: "",
    sigla: "",
    tipo: "",
    activo: true,
  });

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const data = await obtenerInstituciones();
    setLista(data);
  };

  const setValue = (name: keyof Institucion, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarForm = () => {
    setForm({
      nombre: "",
      sigla: "",
      tipo: "",
      activo: true,
    });
    setEditando(null);
  };

  const abrirNuevo = () => {
    limpiarForm();
    setModal(true);
  };

  const abrirEditar = (item: Institucion) => {
    setEditando(item);
    setForm({
      nombre: item.nombre || "",
      sigla: item.sigla || "",
      tipo: item.tipo || "",
      activo: item.activo ?? true,
    });
    setModal(true);
  };

  const filtradas = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) return lista;

    return lista.filter((x) =>
      `${x.nombre || ""} ${x.sigla || ""} ${x.tipo || ""}`
        .toLowerCase()
        .includes(texto)
    );
  }, [lista, busqueda]);

  const total = lista.length;
  const activas = lista.filter((x) => x.activo).length;
  const inactivas = lista.filter((x) => !x.activo).length;
  const tipos = new Set(lista.map((x) => x.tipo).filter(Boolean)).size;

  const guardar = async () => {
    if (!form.nombre?.trim()) {
      Swal.fire("Campo obligatorio", "Ingrese el nombre de la institución.", "warning");
      return;
    }

    try {
      setLoading(true);

      if (editando?.id) {
        await modificarInstitucion(editando.id, form);

        await Swal.fire({
          icon: "success",
          title: "Institución modificada",
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        await crearInstitucion(form);

        await Swal.fire({
          icon: "success",
          title: "Institución registrada",
          timer: 1200,
          showConfirmButton: false,
        });
      }

      setModal(false);
      limpiarForm();
      await cargar();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "No se pudo guardar la institución.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (item: Institucion) => {
    if (!item.id) return;

    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar institución?",
      text: "Esta acción eliminará la institución seleccionada.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmacion.isConfirmed) return;

    await eliminarInstitucion(item.id);

    await Swal.fire({
      icon: "success",
      title: "Institución eliminada",
      timer: 1200,
      showConfirmButton: false,
    });

    await cargar();
  };

  const input =
    "w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-700 shadow-sm outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100";

  const card =
    "rounded-[1.7rem] border border-white/70 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfccb,transparent_35%),linear-gradient(135deg,#f8fbec,#eef7d5)] p-6 text-slate-900">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1f3b08] via-[#456b0b] to-[#96b80d] p-8 text-white shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold">
                Administración Institucional
              </p>

              <h1 className="text-4xl font-black tracking-tight">
                Instituciones
              </h1>

              <p className="mt-2 max-w-2xl text-white/80">
                Registro, control y administración de instituciones, unidades,
                comandos y dependencias relacionadas al personal.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              

              <button
                onClick={abrirNuevo}
                className="rounded-2xl bg-white px-6 py-3 font-black text-lime-800 shadow-xl hover:bg-lime-50"
              >
                + Nueva institución
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-2xl bg-slate-950 px-6 py-3 font-black text-white shadow-xl"
              >
                Volver
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className={card}>
            <p className="text-sm font-bold text-slate-500">Total</p>
            <p className="mt-2 text-4xl font-black text-lime-800">{total}</p>
          </div>

          <div className={card}>
            <p className="text-sm font-bold text-slate-500">Activas</p>
            <p className="mt-2 text-4xl font-black text-green-700">{activas}</p>
          </div>

          <div className={card}>
            <p className="text-sm font-bold text-slate-500">Inactivas</p>
            <p className="mt-2 text-4xl font-black text-red-700">{inactivas}</p>
          </div>

          <div className={card}>
            <p className="text-sm font-bold text-slate-500">Tipos registrados</p>
            <p className="mt-2 text-4xl font-black text-blue-900">{tipos}</p>
          </div>
        </div>

        <div className="mb-6 rounded-[2rem] border border-white bg-white/90 p-6 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black text-lime-900">
                Lista de instituciones
              </h2>
              <p className="text-sm text-slate-500">
                Busque por nombre, sigla o tipo de institución.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar institución..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 outline-none focus:ring-4 focus:ring-lime-100 md:w-[380px]"
              />

              <button
                onClick={() => setBusqueda("")}
                className="rounded-2xl border bg-white px-6 py-3 font-black hover:bg-slate-50"
              >
                Limpiar
              </button>

              <button
                onClick={abrirNuevo}
                className="rounded-2xl bg-lime-700 px-6 py-3 font-black text-white shadow-lg hover:bg-lime-800"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white bg-white/95 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="p-4">N°</th>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Sigla</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Fecha registro</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lime-100 text-4xl">
                        🏢
                      </div>
                      <p className="mt-4 text-2xl font-black">
                        No hay instituciones registradas
                      </p>
                      <p className="mt-2 text-slate-500">
                        Añada la primera institución para comenzar.
                      </p>
                      <button
                        onClick={abrirNuevo}
                        className="mt-5 rounded-2xl bg-slate-950 px-7 py-3 font-black text-white"
                      >
                        Crear institución
                      </button>
                    </td>
                  </tr>
                ) : (
                  filtradas.map((item, index) => (
                    <tr
                      key={item.id}
                      onDoubleClick={() => abrirEditar(item)}
                      className="border-t border-slate-100 transition hover:bg-lime-50"
                    >
                      <td className="p-4 font-bold">{index + 1}</td>

                      <td className="p-4">
                        <p className="font-black text-lime-900">{item.nombre}</p>
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-lime-100 px-4 py-1 font-black text-lime-800">
                          {item.sigla || "S/S"}
                        </span>
                      </td>

                      <td className="p-4">{item.tipo || "-"}</td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-4 py-1 font-black ${
                            item.activo
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.activo ? "Activa" : "Inactiva"}
                        </span>
                      </td>

                      <td className="p-4">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => abrirEditar(item)}
                            className="rounded-full bg-amber-400 px-4 py-2 text-sm font-black text-slate-900 hover:bg-amber-500"
                          >
                            Modificar
                          </button>

                          <button
                            onClick={() => eliminar(item)}
                            className="rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white hover:bg-red-600"
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

          <div className="flex justify-between border-t border-slate-100 bg-slate-50 p-5 text-sm font-bold text-slate-500">
            <span>Mostrando {filtradas.length} de {total}</span>
            <span>Administración de instituciones</span>
          </div>
        </div>

        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-[2rem] bg-white shadow-2xl">
              <div className="border-b p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 font-black text-lime-700">
                      {editando ? "Edición" : "Nuevo registro"}
                    </p>
                    <h2 className="text-3xl font-black">
                      {editando ? "Modificar institución" : "Registrar institución"}
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setModal(false);
                      limpiarForm();
                    }}
                    className="rounded-2xl border bg-white px-5 py-3 font-black hover:bg-slate-50"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block font-black">
                    Nombre de la institución *
                  </label>
                  <input
                    className={input}
                    value={form.nombre || ""}
                    onChange={(e) => setValue("nombre", e.target.value)}
                    placeholder="Ej: Comando Departamental de Cochabamba"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">Sigla</label>
                  <input
                    className={input}
                    value={form.sigla || ""}
                    onChange={(e) => setValue("sigla", e.target.value)}
                    placeholder="Ej: CD-CBBA"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">Tipo</label>
                  <select
                    className={input}
                    value={form.tipo || ""}
                    onChange={(e) => setValue("tipo", e.target.value)}
                  >
                    <option value="">Seleccione...</option>
                    <option value="Comando">Comando</option>
                    <option value="Dirección">Dirección</option>
                    <option value="Unidad">Unidad</option>
                    <option value="División">División</option>
                    <option value="Departamento">Departamento</option>
                    <option value="Estación Policial">Estación Policial</option>
                    <option value="Institución externa">Institución externa</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block font-black">Estado</label>
                  <select
                    className={input}
                    value={form.activo ? "true" : "false"}
                    onChange={(e) => setValue("activo", e.target.value === "true")}
                  >
                    <option value="true">Activa</option>
                    <option value="false">Inactiva</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t p-6">
                <button
                  onClick={() => {
                    setModal(false);
                    limpiarForm();
                  }}
                  className="rounded-2xl border bg-white px-7 py-3 font-black hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  onClick={guardar}
                  disabled={loading}
                  className="rounded-2xl bg-gradient-to-r from-lime-700 to-green-700 px-8 py-3 font-black text-white shadow-lg disabled:opacity-60"
                >
                  {loading ? "Guardando..." : editando ? "Modificar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}