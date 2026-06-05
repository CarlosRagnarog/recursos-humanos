import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  crearRevisionJuridica,
  eliminarRevisionJuridica,
  modificarRevisionJuridica,
  obtenerRevisionesJuridicas,
  type RevisionJuridica,
} from "../services/revisionJuridicaService";

export default function RevisionJuridicaPage() {
  const navigate = useNavigate();

  const [lista, setLista] = useState<RevisionJuridica[]>([]);
  const [tipoActivo, setTipoActivo] = useState<"Libro Oficio" | "Memo Circular">(
    "Libro Oficio"
  );
  const [busqueda, setBusqueda] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<RevisionJuridica | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<RevisionJuridica>({
    tipo: "Libro Oficio",
    fecha: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const data = await obtenerRevisionesJuridicas();
    setLista(data);
  };

  const limpiarForm = () => {
    setForm({
      tipo: tipoActivo,
      fecha: new Date().toISOString().slice(0, 10),
    });
    setEditando(null);
  };

  const abrirNuevo = () => {
    limpiarForm();
    setModal(true);
  };

  const abrirEditar = (item: RevisionJuridica) => {
    setEditando(item);
    setForm({
      ...item,
      fecha: item.fecha || "",
      fechaHora: item.fechaHora ? item.fechaHora.slice(0, 16) : "",
    });
    setModal(true);
  };

  const setValue = (name: keyof RevisionJuridica, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const filtrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return lista.filter((x) => {
      const fecha = x.fecha || "";

      const coincideTipo = x.tipo === tipoActivo;

      const coincideTexto =
        !texto ||
        `${x.codigo || ""} ${x.destino || ""} ${x.origen || ""} ${
          x.motivo || ""
        } ${x.recepcion || ""} ${x.firma || ""} ${x.entrega || ""}`
          .toLowerCase()
          .includes(texto);

      const coincideDesde = !desde || fecha >= desde;
      const coincideHasta = !hasta || fecha <= hasta;

      return coincideTipo && coincideTexto && coincideDesde && coincideHasta;
    });
  }, [lista, tipoActivo, busqueda, desde, hasta]);

  const totalTipo = lista.filter((x) => x.tipo === tipoActivo).length;
  const oficios = lista.filter((x) => x.tipo === "Libro Oficio").length;
  const memos = lista.filter((x) => x.tipo === "Memo Circular").length;

  const guardar = async () => {
    if (!form.codigo?.trim()) {
      Swal.fire("Campo obligatorio", "Ingrese el código o número.", "warning");
      return;
    }

    if (!form.destino?.trim()) {
      Swal.fire("Campo obligatorio", "Ingrese el destino.", "warning");
      return;
    }

    if (!form.origen?.trim()) {
      Swal.fire("Campo obligatorio", "Ingrese el origen.", "warning");
      return;
    }

    if (!form.fecha) {
      Swal.fire("Campo obligatorio", "Ingrese la fecha.", "warning");
      return;
    }

    if (!form.motivo?.trim()) {
      Swal.fire("Campo obligatorio", "Ingrese el motivo.", "warning");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        tipo: tipoActivo,
      };

      if (editando?.id) {
        await modificarRevisionJuridica(editando.id, payload);

        await Swal.fire({
          icon: "success",
          title: "Registro modificado",
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        await crearRevisionJuridica(payload);

        await Swal.fire({
          icon: "success",
          title: "Registro creado",
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

  const eliminar = async (item: RevisionJuridica) => {
    if (!item.id) return;

    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar registro?",
      text: "Esta acción eliminará el registro jurídico.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmacion.isConfirmed) return;

    await eliminarRevisionJuridica(item.id);

    await Swal.fire({
      icon: "success",
      title: "Registro eliminado",
      timer: 1200,
      showConfirmButton: false,
    });

    await cargar();
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setDesde("");
    setHasta("");
  };

  const input =
    "w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-700 shadow-sm outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100";

  const card =
    "rounded-[1.7rem] border border-white/70 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur";

  const tabButton = (tipo: "Libro Oficio" | "Memo Circular") =>
    `rounded-2xl px-6 py-3 font-black transition ${
      tipoActivo === tipo
        ? "bg-gradient-to-r from-lime-700 to-green-700 text-white shadow-lg shadow-lime-900/20"
        : "border border-slate-200 bg-white text-slate-600 hover:bg-lime-50"
    }`;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfccb,transparent_35%),linear-gradient(135deg,#f8fbec,#eef7d5)] p-6 text-slate-900">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1f3b08] via-[#456b0b] to-[#96b80d] p-8 text-white shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold">
                Área Jurídica Institucional
              </p>
              <h1 className="text-4xl font-black tracking-tight">
                Revisión Jurídica
              </h1>
              <p className="mt-2 max-w-2xl text-white/80">
                Control, seguimiento y registro de Libros Oficios y Memos
                Circulares del Comando.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              

              <button
                onClick={abrirNuevo}
                className="rounded-2xl bg-white px-6 py-3 font-black text-lime-800 shadow-xl hover:bg-lime-50"
              >
                + Nuevo registro
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
            <p className="text-sm font-bold text-slate-500">Total activo</p>
            <p className="mt-2 text-4xl font-black text-lime-800">{totalTipo}</p>
          </div>

          <div className={card}>
            <p className="text-sm font-bold text-slate-500">Libro Oficios</p>
            <p className="mt-2 text-4xl font-black text-slate-900">{oficios}</p>
          </div>

          <div className={card}>
            <p className="text-sm font-bold text-slate-500">Memos Circulares</p>
            <p className="mt-2 text-4xl font-black text-slate-900">{memos}</p>
          </div>

          <div className={card}>
            <p className="text-sm font-bold text-slate-500">Mostrando</p>
            <p className="mt-2 text-4xl font-black text-blue-900">
              {filtrados.length}
              <span className="text-lg font-bold text-slate-400">
                {" "}
                / {totalTipo}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setTipoActivo("Libro Oficio");
              limpiarFiltros();
            }}
            className={tabButton("Libro Oficio")}
          >
            Libro Oficios
          </button>

          <button
            onClick={() => {
              setTipoActivo("Memo Circular");
              limpiarFiltros();
            }}
            className={tabButton("Memo Circular")}
          >
            Memos Circulares
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
          <div className="rounded-[2rem] border border-white bg-white/90 p-6 shadow-xl">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-lime-900">Filtros</h2>
              <p className="text-sm text-slate-500">
                Busca por código, destino, origen, firma o motivo.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-black text-slate-700">
                  Buscar registro
                </label>
                <input
                  className={input}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ej: 245/2026, Asesoría, Informe..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block font-black text-slate-700">
                    Desde
                  </label>
                  <input
                    className={input}
                    type="date"
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black text-slate-700">
                    Hasta
                  </label>
                  <input
                    className={input}
                    type="date"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="rounded-2xl bg-lime-700 py-3 font-black text-white shadow-lg hover:bg-lime-800">
                  Aplicar
                </button>

                <button
                  onClick={limpiarFiltros}
                  className="rounded-2xl border border-slate-200 bg-white py-3 font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-slate-950 p-5 text-sm text-white shadow-inner">
              <p className="mb-2 font-black text-lime-300">Atajos rápidos</p>
              <ul className="space-y-1 text-white/80">
                <li>• Doble clic en fila: modificar</li>
                <li>• Botón rojo: eliminar registro</li>
                <li>• Botón nuevo: abrir formulario</li>
              </ul>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white bg-white/95 shadow-xl">
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-white p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-2 inline-flex rounded-full bg-lime-100 px-4 py-1 text-sm font-black text-lime-800">
                  {tipoActivo}
                </p>
                <h2 className="text-2xl font-black">Registros jurídicos</h2>
                <p className="text-sm text-slate-500">
                  {filtrados.length} resultado(s) encontrados
                </p>
              </div>

              <button
                onClick={abrirNuevo}
                className="rounded-2xl bg-lime-700 px-6 py-3 font-black text-white shadow-lg hover:bg-lime-800"
              >
                + Agregar registro
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="p-4">N°</th>
                    <th className="p-4">
                      Código / N°{" "}
                      {tipoActivo === "Libro Oficio" ? "Oficio" : "Memo"}
                    </th>
                    <th className="p-4">Destino</th>
                    <th className="p-4">Origen</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Motivo</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-16 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lime-100 text-4xl">
                          📂
                        </div>
                        <p className="mt-4 text-2xl font-black">
                          No hay resultados
                        </p>
                        <p className="mt-2 text-slate-500">
                          Registra un nuevo documento o ajusta los filtros.
                        </p>
                        <button
                          onClick={abrirNuevo}
                          className="mt-5 rounded-2xl bg-slate-950 px-7 py-3 font-black text-white"
                        >
                          Crear primer registro
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filtrados.map((item, index) => (
                      <tr
                        key={item.id}
                        onDoubleClick={() => abrirEditar(item)}
                        className="border-t border-slate-100 transition hover:bg-lime-50"
                      >
                        <td className="p-4 font-bold">{index + 1}</td>
                        <td className="p-4 font-black text-lime-900">
                          {item.codigo}
                        </td>
                        <td className="p-4">{item.destino}</td>
                        <td className="p-4">{item.origen}</td>
                        <td className="p-4">{item.fecha}</td>
                        <td className="max-w-[300px] truncate p-4">
                          {item.motivo}
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
              <span>Mostrando {filtrados.length} de {totalTipo}</span>
              <span>Vista actual: {tipoActivo}</span>
            </div>
          </div>
        </div>

        {modal && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
            <div className="h-full w-full max-w-3xl overflow-y-auto bg-white shadow-2xl">
              <div className="sticky top-0 z-10 border-b bg-white/95 p-6 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mb-1 font-black text-lime-700">
                      {tipoActivo}
                    </p>
                    <h2 className="text-3xl font-black">
                      {editando ? "Modificar registro" : "Nuevo registro"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Complete los campos obligatorios marcados con *
                    </p>
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
                <div>
                  <label className="mb-2 block font-black">Tipo</label>
                  <input className={input} value={tipoActivo} disabled />
                </div>

                <div>
                  <label className="mb-2 block font-black">
                    Código / N°{" "}
                    {tipoActivo === "Libro Oficio" ? "Oficio" : "Memo"} *
                  </label>
                  <input
                    className={input}
                    value={form.codigo || ""}
                    onChange={(e) => setValue("codigo", e.target.value)}
                    placeholder="Ej: 245/2026"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">Destino *</label>
                  <input
                    className={input}
                    value={form.destino || ""}
                    onChange={(e) => setValue("destino", e.target.value)}
                    placeholder="Unidad o destinatario"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">Origen *</label>
                  <input
                    className={input}
                    value={form.origen || ""}
                    onChange={(e) => setValue("origen", e.target.value)}
                    placeholder="Área de origen"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">Fecha ingreso *</label>
                  <input
                    className={input}
                    type="date"
                    value={form.fecha || ""}
                    onChange={(e) => setValue("fecha", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">
                    Fecha/Hora entrega
                  </label>
                  <input
                    className={input}
                    type="datetime-local"
                    value={form.fechaHora || ""}
                    onChange={(e) => setValue("fechaHora", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">Recepción</label>
                  <input
                    className={input}
                    value={form.recepcion || ""}
                    onChange={(e) => setValue("recepcion", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">Firma</label>
                  <input
                    className={input}
                    value={form.firma || ""}
                    onChange={(e) => setValue("firma", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">Entrega</label>
                  <input
                    className={input}
                    value={form.entrega || ""}
                    onChange={(e) => setValue("entrega", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block font-black">Motivo *</label>
                  <textarea
                    className="min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-700 shadow-sm outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100"
                    value={form.motivo || ""}
                    onChange={(e) => setValue("motivo", e.target.value)}
                    placeholder="Describa el motivo del oficio o memo circular..."
                  />
                </div>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white p-6">
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