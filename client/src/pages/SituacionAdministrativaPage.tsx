import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  obtenerGrados,
  obtenerPersonal,
  obtenerRegistroCompleto,
} from "../services/personalService";
import {
  guardarSituacionAdministrativa,
  obtenerSituacionAdministrativa,
  type SituacionAdministrativa,
} from "../services/situacionAdministrativaService";

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

export default function SituacionAdministrativaPage() {
  const navigate = useNavigate();

  const [personal, setPersonal] = useState<any[]>([]);
  const [grados, setGrados] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<any>(null);
  const [personalId, setPersonalId] = useState<string | null>(null);
  const [tab, setTab] = useState("destino");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<SituacionAdministrativa>({});

  useEffect(() => {
    cargarInicial();
  }, []);

  const cargarInicial = async () => {
    const [personalData, gradosData] = await Promise.all([
      obtenerPersonal(),
      obtenerGrados(),
    ]);

    setPersonal(personalData);
    setGrados(gradosData);
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

  const setValue = (name: keyof SituacionAdministrativa, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const seleccionarPersonal = async (p: any) => {
    try {
      const data = await obtenerRegistroCompleto(p.id);
      const situacion = await obtenerSituacionAdministrativa(p.id);

      setSeleccionado(data);
      setPersonalId(data.id);
      setBusqueda("");

      setForm({
        personalId: data.id,

        unidadAnterior: situacion.unidadAnterior || "",
        unidadActual: situacion.unidadActual || "",
        cargoActual: situacion.cargoActual || "",
        memoNro: situacion.memoNro || "",
        fechaDestino: situacion.fechaDestino || "",
        estadoPersonal: situacion.estadoPersonal || "",
        observacionesDestino: situacion.observacionesDestino || "",

        tipoSituacion: situacion.tipoSituacion || "",
        causal: situacion.causal || "",
        fechaInicio: situacion.fechaInicio || "",
        fechaRetorno: situacion.fechaRetorno || "",
        situacionActual: situacion.situacionActual || "",
        observacionesSituacion: situacion.observacionesSituacion || "",

        fechaBaja: situacion.fechaBaja || "",
        motivoBaja: situacion.motivoBaja || "",
        observacionesBaja: situacion.observacionesBaja || "",

        tipoReclamacion: situacion.tipoReclamacion || "Representaciones",
        fechaReclamacion: situacion.fechaReclamacion || "",
        unidadRepresentada: situacion.unidadRepresentada || "",
        nroMemorandum: situacion.nroMemorandum || "",
        observacionesReclamacion: situacion.observacionesReclamacion || "",
      });
    } catch {
      Swal.fire("Error", "No se pudo cargar el efectivo.", "error");
    }
  };

  const limpiar = () => {
    setForm({});
    setSeleccionado(null);
    setPersonalId(null);
    setBusqueda("");
    setTab("destino");
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

      await guardarSituacionAdministrativa({
        ...form,
        personalId,
      });

      await Swal.fire({
        icon: "success",
        title: "Guardado",
        text: "Situación administrativa registrada correctamente.",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire(
        "Error",
        "No se pudo guardar la situación administrativa.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full rounded-full bg-[#f3f7c8] px-5 py-3 text-slate-800 outline-none ring-1 ring-lime-100 focus:ring-2 focus:ring-lime-500";

  const textarea =
    "min-h-40 w-full rounded-[2rem] bg-[#f3f7c8] p-5 text-slate-800 outline-none ring-1 ring-lime-100 focus:ring-2 focus:ring-lime-500";

  const tabClass = (key: string) =>
    `rounded-full px-8 py-3 font-bold shadow ${
      tab === key ? "bg-[#87a20c] text-white" : "bg-lime-100 text-slate-700"
    }`;

  return (
    <div className="min-h-screen bg-[#f5f8df] p-5 text-[#243300]">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black">Situación Administrativa</h1>
          <p className="text-sm text-slate-500">
            Destino, situación, baja institucional y reclamaciones.
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
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">
                Grado
              </p>
              <p className="text-lg font-black">{seleccionado.grado}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-slate-500">
                Nombre
              </p>
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
        <div className="mb-5 flex flex-wrap gap-4">
          <button
            onClick={() => setTab("destino")}
            className={tabClass("destino")}
          >
            Destino
          </button>

          <button
            onClick={() => setTab("situacion")}
            className={tabClass("situacion")}
          >
            Situación
          </button>

          <button onClick={() => setTab("baja")} className={tabClass("baja")}>
            Fallecimiento o baja de la institución
          </button>

          <button
            onClick={() => setTab("reclamaciones")}
            className={tabClass("reclamaciones")}
          >
            Reclamaciones
          </button>
        </div>

        <div className="rounded-[2rem] border border-lime-200 bg-[#fbfde9] p-8 shadow-inner">
          {tab === "destino" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field title="Unidad Anterior">
                <input
                  className={input}
                  value={form.unidadAnterior || ""}
                  onChange={(e) => setValue("unidadAnterior", e.target.value)}
                />
              </Field>

              <Field title="N° de Memo Actual">
                <input
                  className={input}
                  value={form.memoNro || ""}
                  onChange={(e) => setValue("memoNro", e.target.value)}
                />
              </Field>

              <Field title="Unidad Actual">
                <input
                  className={input}
                  value={form.unidadActual || ""}
                  onChange={(e) => setValue("unidadActual", e.target.value)}
                />
              </Field>

              <Field title="Fecha de Destino">
                <input
                  className={input}
                  type="date"
                  value={form.fechaDestino || ""}
                  onChange={(e) => setValue("fechaDestino", e.target.value)}
                />
              </Field>

              <Field title="Cargo Actual">
                <select
                  className={input}
                  value={form.cargoActual || ""}
                  onChange={(e) => setValue("cargoActual", e.target.value)}
                >
                  <option value="">Seleccione cargo...</option>
                  {grados.map((g) => (
                    <option key={g.id} value={g.nombre}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
              </Field>

              <Field title="Estado del Personal">
                <select
                  className={input}
                  value={form.estadoPersonal || ""}
                  onChange={(e) => setValue("estadoPersonal", e.target.value)}
                >
                  <option value="">Seleccione estado...</option>
                  <option value="Activo">Activo</option>
                  <option value="Disponible">Disponible</option>
                  <option value="En comisión">En comisión</option>
                  <option value="En vacación">En vacación</option>
                  <option value="Replegado">Replegado</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Retirado">Retirado</option>
                  <option value="Baja institucional">Baja institucional</option>
                </select>
              </Field>
            </div>
          )}

          {tab === "situacion" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-2 inline-block rounded-full bg-[#87a20c] px-8 py-2 text-sm font-black text-white shadow">
                    Restitución de Funciones
                  </div>
                </div>

                <div>
                  <div className="mb-2 inline-block rounded-full bg-lime-200 px-8 py-2 text-sm font-black text-slate-700 shadow">
                    Deserción
                  </div>
                </div>
              </div>

              <Field title="Fecha de Inicio">
                <input
                  className={input}
                  type="date"
                  value={form.fechaInicio || ""}
                  onChange={(e) => setValue("fechaInicio", e.target.value)}
                />
              </Field>

              <Field title="Causal">
                <input
                  className={input}
                  value={form.causal || ""}
                  onChange={(e) => setValue("causal", e.target.value)}
                />
              </Field>

              <Field title="Fecha de Retorno">
                <input
                  className={input}
                  type="date"
                  value={form.fechaRetorno || ""}
                  onChange={(e) => setValue("fechaRetorno", e.target.value)}
                />
              </Field>

              <Field title="Situación Actual">
                <select
                  className={input}
                  value={form.situacionActual || ""}
                  onChange={(e) => setValue("situacionActual", e.target.value)}
                >
                  <option value="">Seleccione situación...</option>
                  <option value="Restituido en funciones">
                    Restituido en funciones
                  </option>
                  <option value="Pendiente de retorno">
                    Pendiente de retorno
                  </option>
                  <option value="En trámite administrativo">
                    En trámite administrativo
                  </option>
                  <option value="Con informe legal">Con informe legal</option>
                  <option value="Con resolución">Con resolución</option>
                  <option value="Desertor">Desertor</option>
                  <option value="Retornado">Retornado</option>
                  <option value="Baja solicitada">Baja solicitada</option>
                  <option value="Archivado">Archivado</option>
                </select>
              </Field>

              <Field title="Observaciones" className="md:col-span-2">
                <textarea
                  className={textarea}
                  value={form.observacionesSituacion || ""}
                  onChange={(e) =>
                    setValue("observacionesSituacion", e.target.value)
                  }
                />
              </Field>
            </div>
          )}

          {tab === "baja" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field title="Fecha de Baja">
                <input
                  className={input}
                  type="date"
                  value={form.fechaBaja || ""}
                  onChange={(e) => setValue("fechaBaja", e.target.value)}
                />
              </Field>

              <Field title="Motivo">
                <input
                  className={input}
                  value={form.motivoBaja || ""}
                  onChange={(e) => setValue("motivoBaja", e.target.value)}
                />
              </Field>

              <Field title="Observaciones" className="md:col-span-2">
                <textarea
                  className={textarea}
                  value={form.observacionesBaja || ""}
                  onChange={(e) =>
                    setValue("observacionesBaja", e.target.value)
                  }
                />
              </Field>
            </div>
          )}

          {tab === "reclamaciones" && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field title="Fecha">
                  <input
                    className={input}
                    type="date"
                    value={form.fechaReclamacion || ""}
                    onChange={(e) =>
                      setValue("fechaReclamacion", e.target.value)
                    }
                  />
                </Field>

                <Field title="Unidad Representada">
                  <input
                    className={input}
                    value={form.unidadRepresentada || ""}
                    onChange={(e) =>
                      setValue("unidadRepresentada", e.target.value)
                    }
                  />
                </Field>

                <Field title="Número Memorándum">
                  <input
                    className={input}
                    value={form.nroMemorandum || ""}
                    onChange={(e) => setValue("nroMemorandum", e.target.value)}
                  />
                </Field>

                <Field title="Observaciones" className="md:col-span-2">
                  <textarea
                    className={textarea}
                    value={form.observacionesReclamacion || ""}
                    onChange={(e) =>
                      setValue("observacionesReclamacion", e.target.value)
                    }
                  />
                </Field>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-4">
          <button
            onClick={limpiar}
            className="rounded-full bg-slate-500 px-10 py-3 font-black text-white shadow-lg hover:bg-slate-600"
          >
            Limpiar
          </button>

          <button
            onClick={guardar}
            disabled={loading || !personalId}
            className="rounded-full bg-lime-500 px-10 py-3 font-black text-white shadow-lg hover:bg-lime-600 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
