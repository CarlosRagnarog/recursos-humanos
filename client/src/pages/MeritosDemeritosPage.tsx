import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  obtenerGrados,
  obtenerPersonal,
  obtenerRegistroCompleto,
} from "../services/personalService";
import {
  crearMeritoDemerito,
  eliminarMeritoDemerito,
  modificarMeritoDemerito,
  obtenerMeritosDemeritos,
  type MeritoDemerito,
} from "../services/meritosDemeritosService";

const tabs = [
  { key: "cambio-destino", label: "M. de Cambio de destino" },
  { key: "destinos", label: "Destinos" },
  { key: "vacaciones", label: "Vacaciones" },
  { key: "bajas-medicas", label: "Bajas médicas" },
  { key: "comisiones", label: "Comisiones" },
  { key: "didipi", label: "DI.DI.PI." },
  { key: "felicitaciones", label: "M. de felicitación" },
  { key: "llamadas-atencion", label: "M. de Llamada de atención" },
  { key: "designaciones", label: "M. de Designación" },
  { key: "pasaportes", label: "Pasaportes" },
];

export default function MeritosDemeritosPage() {
  const navigate = useNavigate();

  const [personal, setPersonal] = useState<any[]>([]);
  const [grados, setGrados] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<any>(null);
  const [personalId, setPersonalId] = useState<string | null>(null);
  const [tab, setTab] = useState("cambio-destino");
  const [lista, setLista] = useState<MeritoDemerito[]>([]);
  const [form, setForm] = useState<MeritoDemerito>({ tipo: "cambio-destino" });
  const [registroSeleccionado, setRegistroSeleccionado] =
    useState<MeritoDemerito | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarInicial();
  }, []);

  useEffect(() => {
    limpiarFormulario();
    if (personalId) cargarLista(tab, personalId);
  }, [tab, personalId]);

  useEffect(() => {
    if (
      (tab === "vacaciones" || tab === "bajas-medicas" || tab === "pasaportes") &&
      form.desde &&
      form.hasta
    ) {
      setValue("dias", calcularDias(form.desde, form.hasta));
    }
  }, [form.desde, form.hasta, tab]);

  const cargarInicial = async () => {
    const [personalData, gradosData] = await Promise.all([
      obtenerPersonal(),
      obtenerGrados(),
    ]);

    setPersonal(personalData);
    setGrados(gradosData);
  };

  const cargarLista = async (tipo: string, id: string) => {
    const data = await obtenerMeritosDemeritos(id, tipo);
    setLista(data);
  };

  const resultados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();
    if (!texto) return [];

    return personal.filter((p) => {
      const nombre = `${p.primerNombre || ""} ${p.segundoNombre || ""} ${
        p.apPaterno || ""
      } ${p.apMaterno || ""}`.toLowerCase();

      return (
        nombre.includes(texto) ||
        (p.ci || "").toLowerCase().includes(texto) ||
        (p.escalafon || "").toLowerCase().includes(texto)
      );
    });
  }, [busqueda, personal]);

  const seleccionarPersonal = async (p: any) => {
    const data = await obtenerRegistroCompleto(p.id);
    setSeleccionado(data);
    setPersonalId(data.id);
    setBusqueda("");
    await cargarLista(tab, data.id);
  };

  const calcularDias = (desde: string, hasta: string) => {
    const inicio = new Date(desde);
    const fin = new Date(hasta);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) return null;

    const diferencia = fin.getTime() - inicio.getTime();
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24)) + 1;

    return dias > 0 ? dias : null;
  };

  const setValue = (name: keyof MeritoDemerito, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setForm({ tipo: tab });
    setRegistroSeleccionado(null);
  };

  const seleccionarRegistro = (registro: MeritoDemerito) => {
    setRegistroSeleccionado(registro);

    setForm({
      ...registro,
      tipo: tab,
      dias: registro.dias ?? null,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardar = async () => {
    if (!personalId) {
      Swal.fire("Seleccione personal", "Debe seleccionar un efectivo.", "warning");
      return;
    }

    try {
      setLoading(true);

      await crearMeritoDemerito({
        ...form,
        tipo: tab,
        personalId,
        dias: form.dias ? Number(form.dias) : null,
      });

      await Swal.fire({
        icon: "success",
        title: "Registro agregado",
        timer: 1200,
        showConfirmButton: false,
      });

      limpiarFormulario();
      await cargarLista(tab, personalId);
    } catch {
      Swal.fire("Error", "No se pudo agregar el registro.", "error");
    } finally {
      setLoading(false);
    }
  };

  const modificar = async () => {
    if (!personalId || !registroSeleccionado?.id) {
      Swal.fire("Seleccione registro", "Debe seleccionar una fila de la tabla.", "warning");
      return;
    }

    try {
      setLoading(true);

      await modificarMeritoDemerito(tab, registroSeleccionado.id, {
        ...form,
        tipo: tab,
        personalId,
        dias: form.dias ? Number(form.dias) : null,
      });

      await Swal.fire({
        icon: "success",
        title: "Registro modificado",
        timer: 1200,
        showConfirmButton: false,
      });

      limpiarFormulario();
      await cargarLista(tab, personalId);
    } catch {
      Swal.fire("Error", "No se pudo modificar el registro.", "error");
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async () => {
    if (!personalId || !registroSeleccionado?.id) {
      Swal.fire("Seleccione registro", "Debe seleccionar una fila de la tabla.", "warning");
      return;
    }

    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar registro?",
      text: "Esta acción eliminará el registro seleccionado.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmacion.isConfirmed) return;

    await eliminarMeritoDemerito(tab, registroSeleccionado.id);

    await Swal.fire({
      icon: "success",
      title: "Registro eliminado",
      timer: 1200,
      showConfirmButton: false,
    });

    limpiarFormulario();
    await cargarLista(tab, personalId);
  };

  const input =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-lime-500";

  const active = (key: string) =>
    `rounded-full px-6 py-3 font-bold shadow ${
      tab === key ? "bg-lime-500 text-white" : "bg-lime-100 text-slate-700"
    }`;

  const titulo = tabs.find((t) => t.key === tab)?.label || "";

  const selectGrados = (
    <select
      className={input}
      value={form.cargoActual || ""}
      onChange={(e) => setValue("cargoActual", e.target.value)}
    >
      <option value="">Cargo actual</option>
      {grados.map((g) => (
        <option key={g.id} value={g.nombre}>
          {g.nombre}
        </option>
      ))}
    </select>
  );

  const renderForm = () => {
    if (tab === "cambio-destino") {
      return (
        <>
          <input
            className={input}
            placeholder="Unidad anterior"
            value={form.unidadAnterior || ""}
            onChange={(e) => setValue("unidadAnterior", e.target.value)}
          />
          <input
            className={input}
            placeholder="Unidad actual"
            value={form.unidadActual || ""}
            onChange={(e) => setValue("unidadActual", e.target.value)}
          />
          {selectGrados}
          <input
            className={input}
            placeholder="Memo N°"
            value={form.nroMemo || ""}
            onChange={(e) => setValue("nroMemo", e.target.value)}
          />
          <input
            className={input}
            type="date"
            value={form.fecha || ""}
            onChange={(e) => setValue("fecha", e.target.value)}
          />
          <input
            className={input}
            placeholder="Estado del personal"
            value={form.estadoPersonal || ""}
            onChange={(e) => setValue("estadoPersonal", e.target.value)}
          />
          <input
            className={`${input} md:col-span-4`}
            placeholder="Observaciones"
            value={form.observaciones || ""}
            onChange={(e) => setValue("observaciones", e.target.value)}
          />
        </>
      );
    }

    if (tab === "destinos") {
      return (
        <>
          <input
            className={input}
            placeholder="Unidad anterior"
            value={form.unidadAnterior || ""}
            onChange={(e) => setValue("unidadAnterior", e.target.value)}
          />
          <input
            className={input}
            placeholder="Unidad actual"
            value={form.unidadActual || ""}
            onChange={(e) => setValue("unidadActual", e.target.value)}
          />
          <input
            className={input}
            placeholder="Memo / ID"
            value={form.nroMemo || ""}
            onChange={(e) => setValue("nroMemo", e.target.value)}
          />
          <input
            className={input}
            type="date"
            value={form.fecha || ""}
            onChange={(e) => setValue("fecha", e.target.value)}
          />
          <input
            className={input}
            placeholder="Estado del personal"
            value={form.estadoPersonal || ""}
            onChange={(e) => setValue("estadoPersonal", e.target.value)}
          />
          <input
            className={`${input} md:col-span-4`}
            placeholder="Observaciones"
            value={form.observaciones || ""}
            onChange={(e) => setValue("observaciones", e.target.value)}
          />
        </>
      );
    }

    if (tab === "vacaciones") {
      return (
        <>
          <input
            className={input}
            placeholder="N°"
            value={form.nro || ""}
            onChange={(e) => setValue("nro", e.target.value)}
          />
          <input
            className={input}
            placeholder="N° Memo"
            value={form.nroMemo || ""}
            onChange={(e) => setValue("nroMemo", e.target.value)}
          />
          <input
            className={input}
            type="date"
            value={form.desde || ""}
            onChange={(e) => setValue("desde", e.target.value)}
          />
          <input
            className={input}
            type="date"
            value={form.hasta || ""}
            onChange={(e) => setValue("hasta", e.target.value)}
          />
          <input
            className={input}
            placeholder="Días"
            type="number"
            readOnly
            value={form.dias || ""}
          />
          <input
            className={input}
            placeholder="Observaciones"
            value={form.observaciones || ""}
            onChange={(e) => setValue("observaciones", e.target.value)}
          />
          <input
            className={`${input} md:col-span-2`}
            placeholder="Autoridad que firma"
            value={form.autoridadFirma || ""}
            onChange={(e) => setValue("autoridadFirma", e.target.value)}
          />
        </>
      );
    }

    if (tab === "bajas-medicas") {
      return (
        <>
          <input
            className={input}
            placeholder="N°"
            value={form.nro || ""}
            onChange={(e) => setValue("nro", e.target.value)}
          />
          <input
            className={input}
            placeholder="N° Folio"
            value={form.nroFolio || ""}
            onChange={(e) => setValue("nroFolio", e.target.value)}
          />
          <input
            className={input}
            type="date"
            value={form.desde || ""}
            onChange={(e) => setValue("desde", e.target.value)}
          />
          <input
            className={input}
            type="date"
            value={form.hasta || ""}
            onChange={(e) => setValue("hasta", e.target.value)}
          />
          <input className={input} placeholder="Días" type="number" readOnly value={form.dias || ""} />
          <input
            className={input}
            placeholder="Baja médica / Instituto"
            value={form.institucionMedica || ""}
            onChange={(e) => setValue("institucionMedica", e.target.value)}
          />
          <input
            className={`${input} md:col-span-2`}
            placeholder="Observaciones"
            value={form.observaciones || ""}
            onChange={(e) => setValue("observaciones", e.target.value)}
          />
        </>
      );
    }

    if (tab === "comisiones") {
      return (
        <>
          <input className={input} placeholder="N°" value={form.nro || ""} onChange={(e) => setValue("nro", e.target.value)} />
          <input className={input} placeholder="N° Folio" value={form.nroFolio || ""} onChange={(e) => setValue("nroFolio", e.target.value)} />
          <input className={input} placeholder="N° Memo" value={form.nroMemo || ""} onChange={(e) => setValue("nroMemo", e.target.value)} />
          <input className={input} type="date" value={form.desde || ""} onChange={(e) => setValue("desde", e.target.value)} />
          <input className={input} type="date" value={form.hasta || ""} onChange={(e) => setValue("hasta", e.target.value)} />
          <input className={input} placeholder="Unidad / Ins. Org." value={form.unidadOrg || ""} onChange={(e) => setValue("unidadOrg", e.target.value)} />
          <input className={input} placeholder="Autoridad que firma" value={form.autoridadFirma || ""} onChange={(e) => setValue("autoridadFirma", e.target.value)} />
        </>
      );
    }

    if (tab === "didipi") {
      return (
        <>
          <input className={input} placeholder="N°" value={form.nro || ""} onChange={(e) => setValue("nro", e.target.value)} />
          <input className={input} placeholder="N° Folio" value={form.nroFolio || ""} onChange={(e) => setValue("nroFolio", e.target.value)} />
          <input className={input} placeholder="N° Memo" value={form.nroMemo || ""} onChange={(e) => setValue("nroMemo", e.target.value)} />
          <input className={input} type="date" value={form.fecha || ""} onChange={(e) => setValue("fecha", e.target.value)} />
          <input className={input} placeholder="Causal" value={form.causal || ""} onChange={(e) => setValue("causal", e.target.value)} />
          <input className={input} placeholder="Observaciones" value={form.observaciones || ""} onChange={(e) => setValue("observaciones", e.target.value)} />
          <input className={input} placeholder="Autoridad que firma" value={form.autoridadFirma || ""} onChange={(e) => setValue("autoridadFirma", e.target.value)} />
        </>
      );
    }

    if (tab === "felicitaciones" || tab === "llamadas-atencion") {
      return (
        <>
          <input className={input} placeholder="N°" value={form.nro || ""} onChange={(e) => setValue("nro", e.target.value)} />
          <input className={input} placeholder="N° Folio" value={form.nroFolio || ""} onChange={(e) => setValue("nroFolio", e.target.value)} />
          <input className={input} placeholder="N° Memo" value={form.nroMemo || ""} onChange={(e) => setValue("nroMemo", e.target.value)} />
          <input className={input} type="date" value={form.fecha || ""} onChange={(e) => setValue("fecha", e.target.value)} />
          <input
            className={input}
            placeholder={tab === "felicitaciones" ? "Motivo" : "Motivo de la sanción"}
            value={form.motivo || ""}
            onChange={(e) => setValue("motivo", e.target.value)}
          />
          <input className={input} placeholder="Autoridad que firma" value={form.autoridadFirma || ""} onChange={(e) => setValue("autoridadFirma", e.target.value)} />
        </>
      );
    }

    if (tab === "designaciones") {
      return (
        <>
          <input className={input} placeholder="N°" value={form.nro || ""} onChange={(e) => setValue("nro", e.target.value)} />
          <input className={input} placeholder="N° Folio" value={form.nroFolio || ""} onChange={(e) => setValue("nroFolio", e.target.value)} />
          <input className={input} placeholder="N° Memo" value={form.nroMemo || ""} onChange={(e) => setValue("nroMemo", e.target.value)} />
          <input className={input} type="date" value={form.fecha || ""} onChange={(e) => setValue("fecha", e.target.value)} />
          <input className={input} placeholder="Designación" value={form.designacion || ""} onChange={(e) => setValue("designacion", e.target.value)} />
          <input className={input} placeholder="Autoridad que firma" value={form.autoridadFirma || ""} onChange={(e) => setValue("autoridadFirma", e.target.value)} />
        </>
      );
    }

    if (tab === "pasaportes") {
      return (
        <>
          <input className={input} placeholder="N°" value={form.nro || ""} onChange={(e) => setValue("nro", e.target.value)} />
          <input className={input} placeholder="N° Folio" value={form.nroFolio || ""} onChange={(e) => setValue("nroFolio", e.target.value)} />
          <input className={input} placeholder="N° Pasaporte" value={form.nroPasaporte || ""} onChange={(e) => setValue("nroPasaporte", e.target.value)} />
          <input className={input} placeholder="Días" type="number" readOnly value={form.dias || ""} />
          <input className={input} type="date" value={form.desde || ""} onChange={(e) => setValue("desde", e.target.value)} />
          <input className={input} type="date" value={form.hasta || ""} onChange={(e) => setValue("hasta", e.target.value)} />
          <input className={input} placeholder="Dónde" value={form.destino || ""} onChange={(e) => setValue("destino", e.target.value)} />
          <input className={input} placeholder="Motivo" value={form.motivo || ""} onChange={(e) => setValue("motivo", e.target.value)} />
        </>
      );
    }

    return null;
  };

  const obtenerCeldas = (r: MeritoDemerito) => {
    if (tab === "cambio-destino") {
      return [
        r.nroMemo || r.id,
        r.fecha,
        r.unidadAnterior,
        r.unidadActual,
        r.cargoActual,
        r.estadoPersonal,
        r.observaciones,
      ];
    }

    if (tab === "destinos") {
      return [
        r.nroMemo || r.id,
        r.fecha,
        r.unidadAnterior,
        r.unidadActual,
        r.estadoPersonal,
        r.observaciones,
      ];
    }

    if (tab === "vacaciones") {
      return [r.nro, r.nroMemo, r.desde, r.hasta, r.dias, r.observaciones, r.autoridadFirma];
    }

    if (tab === "bajas-medicas") {
      return [r.nro, r.nroFolio, r.desde, r.hasta, r.dias, r.institucionMedica, r.observaciones];
    }

    if (tab === "comisiones") {
      return [r.nro, r.nroFolio, r.nroMemo, r.desde, r.hasta, r.unidadOrg, r.autoridadFirma];
    }

    if (tab === "didipi") {
      return [r.nro, r.nroFolio, r.nroMemo, r.fecha, r.causal, r.observaciones, r.autoridadFirma];
    }

    if (tab === "felicitaciones") {
      return [r.nro, r.nroFolio, r.nroMemo, r.fecha, r.motivo, r.autoridadFirma];
    }

    if (tab === "llamadas-atencion") {
      return [r.nro, r.nroFolio, r.nroMemo, r.fecha, r.motivo, r.autoridadFirma];
    }

    if (tab === "designaciones") {
      return [r.nro, r.nroFolio, r.nroMemo, r.fecha, r.designacion, r.autoridadFirma];
    }

    return [r.nro, r.nroFolio, r.nroPasaporte, r.dias, r.desde, r.hasta, r.destino, r.motivo];
  };

  const columnas = () => {
    if (tab === "cambio-destino") {
      return [
        "Memo / ID",
        "Fecha destino",
        "Unidad anterior",
        "Unidad actual",
        "Cargo actual",
        "Estado",
        "Observaciones",
      ];
    }

    if (tab === "destinos") {
      return [
        "Memo / ID",
        "Fecha destino",
        "Unidad anterior",
        "Unidad actual",
        "Estado",
        "Observaciones",
      ];
    }

    if (tab === "vacaciones") {
      return ["N°", "N° Memo", "Desde", "Hasta", "Días", "Observaciones", "Autoridad"];
    }

    if (tab === "bajas-medicas") {
      return ["N°", "N° Folio", "Desde", "Hasta", "Días", "Instituto", "Observaciones"];
    }

    if (tab === "comisiones") {
      return ["N°", "N° Folio", "N° Memo", "Desde", "Hasta", "Unidad", "Autoridad"];
    }

    if (tab === "didipi") {
      return ["N°", "N° Folio", "N° Memo", "Fecha", "Causal", "Observaciones", "Autoridad"];
    }

    if (tab === "felicitaciones") {
      return ["N°", "N° Folio", "N° Memo", "Fecha entrega", "Motivo", "Autoridad"];
    }

    if (tab === "llamadas-atencion") {
      return ["N°", "N° Folio", "N° Memo", "Fecha entrega", "Motivo sanción", "Autoridad"];
    }

    if (tab === "designaciones") {
      return ["N°", "N° Folio", "N° Memo", "Fecha entrega", "Designación", "Autoridad"];
    }

    return ["N°", "N° Folio", "N° Pasaporte", "Días", "Salida", "Llegada", "Dónde", "Motivo"];
  };

  return (
    <div className="min-h-screen bg-[#f5f8df] p-5 text-[#243300]">
      <div className="mb-5 flex justify-between">
        <div>
          <h1 className="text-3xl font-black">Méritos / Deméritos</h1>
          <p className="text-sm text-slate-500">
            Registros administrativos del efectivo policial.
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
                    {p.grado} - {p.primerNombre} {p.apPaterno} {p.apMaterno}
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
            <div><b>Grado:</b> {seleccionado.grado}</div>
            <div><b>Nombre:</b> {seleccionado.primerNombre} {seleccionado.apPaterno}</div>
            <div><b>C.I.:</b> {seleccionado.ci} {seleccionado.exp}</div>
            <div><b>Escalafón:</b> {seleccionado.escalafon}</div>
          </div>
        )}
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-xl">
        <div className="mb-6 flex flex-wrap gap-4">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={active(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-[2rem] border border-lime-200 bg-[#fbfde9] p-6 shadow-inner">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-black">{titulo}</h2>

            <div className="flex gap-3">
              <button
                onClick={guardar}
                disabled={loading || !personalId}
                className="rounded-full bg-lime-500 px-7 py-2 font-black text-white shadow disabled:opacity-60"
              >
                Añadir
              </button>

              <button
                onClick={modificar}
                disabled={loading || !registroSeleccionado}
                className="rounded-full bg-yellow-400 px-7 py-2 font-black text-slate-800 shadow disabled:opacity-60"
              >
                Modificar
              </button>

              <button
                onClick={eliminar}
                disabled={loading || !registroSeleccionado}
                className="rounded-full bg-red-500 px-7 py-2 font-black text-white shadow disabled:opacity-60"
              >
                Eliminar
              </button>

              <button
                onClick={limpiarFormulario}
                className="rounded-full bg-slate-500 px-7 py-2 font-black text-white shadow"
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            {renderForm()}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-lime-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-[#f3f7c8]">
                <tr>
                  {columnas().map((c) => (
                    <th key={c} className="p-3 font-black">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {lista.length === 0 ? (
                  <tr>
                    <td colSpan={columnas().length} className="p-8 text-center text-slate-400">
                      No hay registros.
                    </td>
                  </tr>
                ) : (
                  lista.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => seleccionarRegistro(r)}
                      className={`cursor-pointer border-t hover:bg-lime-50 ${
                        registroSeleccionado?.id === r.id ? "bg-lime-100" : ""
                      }`}
                    >
                      {obtenerCeldas(r).map((valor, index) => (
                        <td key={index} className="p-3">
                          {valor || "-"}
                        </td>
                      ))}
                    </tr>
                  ))
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