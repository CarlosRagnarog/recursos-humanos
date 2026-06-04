import api from "../api/axiosConfig";

export interface SituacionAdministrativa {
  personalId?: string;

  unidadAnterior?: string;
  unidadActual?: string;
  cargoActual?: string;
  memoNro?: string;
  fechaDestino?: string;
  estadoPersonal?: string;
  observacionesDestino?: string;

  tipoSituacion?: string;
  causal?: string;
  fechaInicio?: string;
  fechaRetorno?: string;
  situacionActual?: string;
  observacionesSituacion?: string;

  fechaBaja?: string;
  motivoBaja?: string;
  observacionesBaja?: string;

  tipoReclamacion?: string;
  fechaReclamacion?: string;
  unidadRepresentada?: string;
  nroMemorandum?: string;
  observacionesReclamacion?: string;
}

export const obtenerSituacionAdministrativa = async (personalId: string) => {
  const response = await api.get(`/SituacionAdministrativa/${personalId}`);
  return response.data;
};

export const guardarSituacionAdministrativa = async (
  data: SituacionAdministrativa
) => {
  const response = await api.post("/SituacionAdministrativa", data);
  return response.data;
};