import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  obtenerPersonal,
  obtenerRegistroCompleto,
} from "../services/personalService";
import {
  crearMeritoDemerito,
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
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<any>(null);
  const [personalId, setPersonalId] = useState<string | null>(null);
  const [tab, setTab] = useState("cambio-destino");
  const [lista, setLista] = useState<MeritoDemerito[]>([]);
  const [form, setForm] = useState<MeritoDemerito>({ tipo: "cambio-destino" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    obtenerPersonal().then(setPersonal);
  }, []);

  useEffect(() => {
    if (personalId) cargarLista(tab, personalId);
    setForm({ tipo: tab });
  }, [tab, personalId]);

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

  const cargarLista = async (tipo: string, id: string) => {
    const data = await obtenerMeritosDemeritos(id, tipo);
    setLista(data);
  };

  const setValue = (name: keyof MeritoDemerito, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiar = () => {
    setForm({ tipo: tab });
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

      limpiar();
      await cargarLista(tab, personalId);
    } catch {
      Swal.fire("Error", "No se pudo guardar el registro.", "error");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-lime-500";

  const active = (key: string) =>
    `rounded-full px-6 py-3 font-bold shadow ${
      tab === key ? "bg-lime-500 text-white" : "bg-lime-100 text-slate-700"
    }`;

  const titulo = tabs.find((t) => t.key === tab)?.label || "";

  const renderForm = () => {
    if (tab === "cambio-destino" || tab === "destinos") {
      return (
        <>
          <input className={input} placeholder="Unidad anterior" value={form.unidadAnterior || ""} onChange={(e) => setValue("unidadAnterior", e.target.value)} />
          <input className={input} placeholder="Unidad actual" value={form.unidadActual || ""} onChange={(e) => setValue("unidadActual", e.target.value)} />
          <input className={input} placeholder="Cargo actual" value={form.cargoActual || ""} onChange={(e) => setValue("cargoActual", e.target.value)} />
          <input className={input} placeholder="Memo N°" value={form.nroMemo || ""} onChange={(e) => setValue("nroMemo", e.target.value)} />
          <input className={input} type="date" value={form.fecha || ""} onChange={(e) => setValue("fecha", e.target.value)} />
          <input className={input} placeholder="Estado del personal" value={form.estadoPersonal || ""} onChange={(e) => setValue("estadoPersonal", e.target.value)} />
          <input className={`${input} md:col-span-3`} placeholder="Observaciones" value={form.observaciones || ""} onChange={(e) => setValue("observaciones", e.target.value)} />
        </>
      );
    }

    if (tab === "vacaciones") {
      return (
        <>
          <input className={input} placeholder="N°" value={form.nro || ""} onChange={(e) => setValue("nro", e.target.value)} />
          <input className={input} placeholder="N° Memo" value={form.nroMemo || ""} onChange={(e) => setValue("nroMemo", e.target.value)} />
          <input className={input} type="date" value={form.desde || ""} onChange={(e) => setValue("desde", e.target.value)} />
          <input className={input} type="date" value={form.hasta || ""} onChange={(e) => setValue("hasta", e.target.value)} />
          <input className={input} placeholder="Días" type="number" value={form.dias || ""} onChange={(e) => setValue("dias", e.target.value)} />
          <input className={input} placeholder="Observaciones" value={form.observaciones || ""} onChange={(e) => setValue("observaciones", e.target.value)} />
          <input className={`${input} md:col-span-2`} placeholder="Autoridad que firma" value={form.autoridadFirma || ""} onChange={(e) => setValue("autoridadFirma", e.target.value)} />
        </>
      );
    }

    if (tab === "bajas-medicas") {
      return (
        <>
          <input className={input} placeholder="N°" value={form.nro || ""} onChange={(e) => setValue("nro", e.target.value)} />
          <input className={input} placeholder="N° Folio" value={form.nroFolio || ""} onChange={(e) => setValue("nroFolio", e.target.value)} />
          <input className={input} type="date" value={form.desde || ""} onChange={(e) => setValue("desde", e.target.value)} />
          <input className={input} type="date" value={form.hasta || ""} onChange={(e) => setValue("hasta", e.target.value)} />
          <input className={input} placeholder="Baja médica / Instituto" value={form.institucionMedica || ""} onChange={(e) => setValue("institucionMedica", e.target.value)} />
          <input className={input} placeholder="Observaciones" value={form.observaciones || ""} onChange={(e) => setValue("observaciones", e.target.value)} />
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
          <input className={input} placeholder={tab === "felicitaciones" ? "Motivo" : "Motivo de la sanción"} value={form.motivo || ""} onChange={(e) => setValue("motivo", e.target.value)} />
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
          <input className={input} placeholder="Días" type="number" value={form.dias || ""} onChange={(e) => setValue("dias", e.target.value)} />
          <input className={input} type="date" value={form.desde || ""} onChange={(e) => setValue("desde", e.target.value)} />
          <input className={input} type="date" value={form.hasta || ""} onChange={(e) => setValue("hasta", e.target.value)} />
          <input className={input} placeholder="Dónde" value={form.destino || ""} onChange={(e) => setValue("destino", e.target.value)} />
          <input className={input} placeholder="Motivo" value={form.motivo || ""} onChange={(e) => setValue("motivo", e.target.value)} />
        </>
      );
    }

    return null;
  };

  const columnas = () => {
    if (tab === "destinos" || tab === "cambio-destino") {
      return ["Memo / ID", "Fecha destino", "Unidad anterior", "Unidad actual", "Cargo actual", "Estado", "Observaciones"];
    }

    if (tab === "vacaciones") {
      return ["N°", "N° Memo", "Desde", "Hasta", "Obs. o días", "Autoridad"];
    }

    if (tab === "bajas-medicas") {
      return ["N°", "N° Folio", "Desde", "Hasta", "Instituto", "Observaciones"];
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
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black">{titulo}</h2>

            <div className="flex gap-3">
              <button onClick={guardar} disabled={loading || !personalId} className="rounded-full bg-lime-500 px-7 py-2 font-black text-white shadow">
                Añadir
              </button>
              <button className="rounded-full bg-yellow-400 px-7 py-2 font-black text-slate-800 shadow">
                Modificar
              </button>
              <button className="rounded-full bg-red-500 px-7 py-2 font-black text-white shadow">
                Eliminar
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
                    <tr key={r.id} className="border-t">
                      <td className="p-3">{r.nro || r.nroMemo || r.id}</td>
                      <td className="p-3">{r.nroFolio || r.fecha || r.nroMemo}</td>
                      <td className="p-3">{r.nroMemo || r.desde || r.unidadAnterior || r.nroPasaporte}</td>
                      <td className="p-3">{r.hasta || r.fecha || r.unidadActual || r.dias}</td>
                      <td className="p-3">{r.motivo || r.causal || r.cargoActual || r.institucionMedica || r.designacion || r.destino}</td>
                      <td className="p-3">{r.autoridadFirma || r.estadoPersonal || r.observaciones}</td>
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