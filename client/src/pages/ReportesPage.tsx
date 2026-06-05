import { useState } from "react";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { obtenerReporte } from "../services/reportesService";

const logo = "./public/log2.png";

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 8, fontFamily: "Helvetica" },
  header: { flexDirection: "row", alignItems: "center", borderBottom: "1 solid #4d7c0f", paddingBottom: 10, marginBottom: 14 },
  logo: { width: 55, height: 55, marginRight: 14 },
  title: { fontSize: 16, fontWeight: "bold", color: "#365314" },
  subtitle: { fontSize: 9, color: "#475569", marginTop: 3 },
  table: { display: "flex", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: "#d9e99a" },
  row: { flexDirection: "row" },
  head: { backgroundColor: "#4d7c0f", color: "white", fontWeight: "bold" },
  cell: { flex: 1, padding: 4, borderRight: "1 solid #d9e99a", borderBottom: "1 solid #d9e99a" },
  footer: { marginTop: 14, fontSize: 8, color: "#64748b", textAlign: "right" },
});

function ReportePDF({
  titulo,
  modulo,
  data,
}: {
  titulo: string;
  modulo: string;
  data: any[];
}) {
  const columnas = data.length > 0 ? Object.keys(data[0]).slice(0, 7) : [];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View>
            <Text style={styles.title}>POLICÍA BOLIVIANA - RR.HH.</Text>
            <Text style={styles.subtitle}>{titulo}</Text>
            <Text style={styles.subtitle}>Módulo: {modulo}</Text>
            <Text style={styles.subtitle}>Fecha de emisión: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, styles.head]}>
            {columnas.map((c) => (
              <Text key={c} style={styles.cell}>{c}</Text>
            ))}
          </View>

          {data.map((item, index) => (
            <View key={index} style={styles.row}>
              {columnas.map((c) => (
                <Text key={c} style={styles.cell}>
                  {item[c] === null || item[c] === undefined ? "-" : String(item[c]).slice(0, 60)}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Total registros: {data.length} · Sistema de Recursos Humanos
        </Text>
      </Page>
    </Document>
  );
}

export default function ReportesPage() {
  const navigate = useNavigate();

  const [modulo, setModulo] = useState("personal");
  const [buscar, setBuscar] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const modulos = [
    { value: "personal", label: "Registro de Personal" },
    { value: "instituciones", label: "Instituciones" },
    { value: "correspondencia", label: "Recepción y Despacho" },
    { value: "revision-juridica", label: "Revisión Jurídica" },
    { value: "meritos", label: "Méritos / Deméritos" },
  ];

  const titulo = modulos.find((m) => m.value === modulo)?.label || "Reporte";

  const generar = async () => {
    try {
      setLoading(true);
      const response = await obtenerReporte(modulo, buscar, desde, hasta);
      setData(response);

      if (response.length === 0) {
        Swal.fire("Sin datos", "No se encontraron registros con esos filtros.", "info");
      }
    } catch {
      Swal.fire("Error", "No se pudo generar el reporte.", "error");
    } finally {
      setLoading(false);
    }
  };

  const input =
    "w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-700 shadow-sm outline-none transition focus:border-lime-500 focus:ring-4 focus:ring-lime-100";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ecfccb,transparent_35%),linear-gradient(135deg,#f8fbec,#eef7d5)] p-6 text-slate-900">
      <div className="mx-auto max-w-[1450px]">
        <div className="mb-6 rounded-[2rem] bg-gradient-to-r from-[#1f3b08] via-[#456b0b] to-[#96b80d] p-8 text-white shadow-2xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-bold">
                Centro de reportes
              </p>
              <h1 className="text-4xl font-black">Reportes Generales</h1>
              <p className="mt-2 text-white/80">
                Genere reportes filtrados y exporte documentos PDF institucionales.
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-2xl bg-slate-950 px-6 py-3 font-black text-white shadow-xl"
            >
              Volver
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-[2rem] bg-white/95 p-6 shadow-xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <label className="mb-2 block font-black">Vista / módulo</label>
              <select className={input} value={modulo} onChange={(e) => setModulo(e.target.value)}>
                {modulos.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-black">Buscar</label>
              <input
                className={input}
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                placeholder="Nombre, CI, código..."
              />
            </div>

            <div>
              <label className="mb-2 block font-black">Desde</label>
              <input className={input} type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </div>

            <div>
              <label className="mb-2 block font-black">Hasta</label>
              <input className={input} type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </div>

            <div className="flex items-end">
              <button
                onClick={generar}
                disabled={loading}
                className="w-full rounded-2xl bg-lime-700 px-6 py-3 font-black text-white shadow-lg disabled:opacity-60"
              >
                {loading ? "Generando..." : "Generar"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setBuscar("");
                setDesde("");
                setHasta("");
                setData([]);
              }}
              className="rounded-2xl border bg-white px-6 py-3 font-black"
            >
              Limpiar
            </button>

            {data.length > 0 && (
              <PDFDownloadLink
                document={<ReportePDF titulo={titulo} modulo={modulo} data={data} />}
                fileName={`reporte-${modulo}.pdf`}
                className="rounded-2xl bg-red-600 px-6 py-3 font-black text-white shadow-lg"
              >
                {({ loading }) => loading ? "Preparando PDF..." : "Exportar PDF"}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] bg-white/95 p-6 shadow-xl">
          <div className="mb-4 flex justify-between">
            <div>
              <h2 className="text-2xl font-black">{titulo}</h2>
              <p className="text-slate-500">Registros encontrados: {data.length}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full text-left">
              <thead className="bg-lime-700 text-white">
                <tr>
                  {data.length > 0 ? (
                    Object.keys(data[0]).map((col) => (
                      <th key={col} className="p-3">{col}</th>
                    ))
                  ) : (
                    <th className="p-3">Vista previa</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td className="p-12 text-center text-slate-500">
                      Seleccione una vista, aplique filtros y presione Generar.
                    </td>
                  </tr>
                ) : (
                  data.map((row, i) => (
                    <tr key={i} className="border-t hover:bg-lime-50">
                      {Object.keys(row).map((col) => (
                        <td key={col} className="p-3">
                          {row[col] === null || row[col] === undefined
                            ? "-"
                            : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}