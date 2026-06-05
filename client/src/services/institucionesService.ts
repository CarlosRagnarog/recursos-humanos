import api from "../api/axiosConfig";

export interface Institucion {
  id?: string;
  nombre?: string;
  sigla?: string;
  tipo?: string;
  activo?: boolean;
  createdAt?: string;
}

export const obtenerInstituciones = async () => {
  const response = await api.get("/Instituciones");
  return response.data;
};

export const crearInstitucion = async (data: Institucion) => {
  const response = await api.post("/Instituciones", data);
  return response.data;
};

export const modificarInstitucion = async (id: string, data: Institucion) => {
  const response = await api.put(`/Instituciones/${id}`, data);
  return response.data;
};

export const eliminarInstitucion = async (id: string) => {
  const response = await api.delete(`/Instituciones/${id}`);
  return response.data;
};