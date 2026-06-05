import api from "../api/axiosConfig";

export interface Correspondencia {
  id?: number;
  tipo?: string;
  codigoRegistro?: string;
  origen?: string;
  nroOficio?: string;
  referencia?: string;
  remitente?: string;
  seccion?: string;
  fechaHora?: string;
  firma?: string;
  tiempoRespuesta?: string;
}

export const obtenerCorrespondencias = async () => {
  const response = await api.get("/Correspondencia");
  return response.data;
};

export const crearCorrespondencia = async (data: Correspondencia) => {
  const response = await api.post("/Correspondencia", data);
  return response.data;
};

export const modificarCorrespondencia = async (
  id: number,
  data: Correspondencia
) => {
  const response = await api.put(`/Correspondencia/${id}`, data);
  return response.data;
};

export const eliminarCorrespondencia = async (id: number) => {
  const response = await api.delete(`/Correspondencia/${id}`);
  return response.data;
};