import api from "../api/axiosConfig";

export interface MeritoDemerito {
  id?: number;
  personalId?: string;
  tipo: string;

  nro?: string;
  nroFolio?: string;
  nroMemo?: string;

  fecha?: string;
  desde?: string;
  hasta?: string;

  dias?: number | null;

  unidadAnterior?: string;
  unidadActual?: string;
  cargoActual?: string;
  estadoPersonal?: string;

  unidadOrg?: string;
  institucionMedica?: string;
  causal?: string;
  motivo?: string;
  designacion?: string;
  destino?: string;
  nroPasaporte?: string;

  observaciones?: string;
  autoridadFirma?: string;
}

export const obtenerMeritosDemeritos = async (
  personalId: string,
  tipo: string
) => {
  const response = await api.get(`/MeritosDemeritos/${personalId}/${tipo}`);
  return response.data;
};

export const crearMeritoDemerito = async (data: MeritoDemerito) => {
  const response = await api.post("/MeritosDemeritos", data);
  return response.data;
};
export const modificarMeritoDemerito = async (
  tipo: string,
  id: number,
  data: MeritoDemerito
) => {
  const response = await api.put(`/MeritosDemeritos/${tipo}/${id}`, data);
  return response.data;
};

export const eliminarMeritoDemerito = async (tipo: string, id: number) => {
  const response = await api.delete(`/MeritosDemeritos/${tipo}/${id}`);
  return response.data;
};