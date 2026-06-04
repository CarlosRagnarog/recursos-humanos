import api from "../api/axiosConfig";

export interface RegistroPersonalCompleto {
  id?: string;
  escalafon?: string;
  primerNombre?: string;
  segundoNombre?: string;
  apPaterno?: string;
  apMaterno?: string;
  apEsposo?: string;
  gradoId?: number | null;
  ci?: string;
  exp?: string;
  genero?: string;
  alturaCm?: number | null;
  pesoKg?: number | null;
  fotoUrl?: string;

  estadoCivil?: string;
  fechaNacimiento?: string;
  grupoSanguineo?: string;
  fechaIngreso?: string;
  telCel?: string;
  telPart?: string;
  direccion?: string;
  zona?: string;
  sigep?: string;
  email?: string;

  emergenciaNombres?: string;
  emergenciaApellidos?: string;
  emergenciaTelefono?: string;
  emergenciaCelular?: string;
  emergenciaDireccion?: string;

  dependienteTipo?: string;
  dependienteNombres?: string;
  dependienteApellidos?: string;
  dependienteCelular?: string;
  dependienteDireccion?: string;

  especialidadTexto?: string;
}

export const registrarPersonalCompleto = async (data: RegistroPersonalCompleto) => {
  const response = await api.post("/Personal/registro-completo", data);
  return response.data;
};

export const obtenerPersonal = async () => {
  const response = await api.get("/Personal");
  return response.data;
};

export const eliminarPersonal = async (id: string) => {
  const response = await api.delete(`/Personal/${id}`);
  return response.data;
};

export const actualizarPersonal = async (id: string, data: RegistroPersonalCompleto) => {
  const response = await api.put(`/Personal/${id}`, data);
  return response.data;
};

export const obtenerGrados = async () => {
  const response = await api.get("/Grados");
  return response.data;
};

export const subirFotoPersonal = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/Uploads/personal-foto", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
export const obtenerRegistroCompleto = async (id: string) => {
  const response = await api.get(`/Personal/registro-completo/${id}`);
  return response.data;
};

export const actualizarDatosComplementarios = async (
  id: string,
  data: RegistroPersonalCompleto
) => {
  const response = await api.put(`/Personal/datos-complementarios/${id}`, data);
  return response.data;
};