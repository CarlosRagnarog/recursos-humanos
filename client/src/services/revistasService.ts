import api from "../api/axiosConfig";

export interface Revista {
  id: number;
  personalId: string;
  nombre?: string;
  informacion?: string;
  archivoUrl?: string;
  archivoNombre?: string;
  createdAt?: string;
}

export const obtenerRevistas = async (personalId: string) => {
  const response = await api.get(`/Revistas/${personalId}`);
  return response.data;
};

export const crearRevista = async (
  personalId: string,
  nombre: string,
  informacion: string,
  file: File
) => {
  const formData = new FormData();
  formData.append("personalId", personalId);
  formData.append("nombre", nombre);
  formData.append("informacion", informacion);
  formData.append("file", file);

  const response = await api.post("/Revistas", formData);
  return response.data;
};

export const modificarRevista = async (
  id: number,
  nombre: string,
  informacion: string,
  file?: File | null
) => {
  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("informacion", informacion);

  if (file) formData.append("file", file);

  const response = await api.put(`/Revistas/${id}`, formData);
  return response.data;
};

export const eliminarRevista = async (id: number) => {
  const response = await api.delete(`/Revistas/${id}`);
  return response.data;
};