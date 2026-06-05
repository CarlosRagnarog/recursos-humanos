import api from "../api/axiosConfig";

export interface RevisionJuridica {
  id?: number;
  tipo?: string;
  codigo?: string;
  destino?: string;
  origen?: string;
  fecha?: string;
  fechaHora?: string;
  motivo?: string;
  recepcion?: string;
  firma?: string;
  entrega?: string;
  createdAt?: string;
}

export const obtenerRevisionesJuridicas = async () => {
  const response = await api.get("/RevisionJuridica");
  return response.data;
};

export const crearRevisionJuridica = async (data: RevisionJuridica) => {
  const response = await api.post("/RevisionJuridica", data);
  return response.data;
};

export const modificarRevisionJuridica = async (
  id: number,
  data: RevisionJuridica
) => {
  const response = await api.put(`/RevisionJuridica/${id}`, data);
  return response.data;
};

export const eliminarRevisionJuridica = async (id: number) => {
  const response = await api.delete(`/RevisionJuridica/${id}`);
  return response.data;
};