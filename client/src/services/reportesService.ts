import api from "../api/axiosConfig";

export const obtenerReporte = async (
  modulo: string,
  buscar: string,
  desde: string,
  hasta: string
) => {
  const response = await api.get(`/Reportes/${modulo}`, {
    params: {
      buscar,
      desde: desde || undefined,
      hasta: hasta || undefined,
    },
  });

  return response.data;
};