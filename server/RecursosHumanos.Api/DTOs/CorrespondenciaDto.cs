namespace RecursosHumanos.Api.DTOs;

public class CorrespondenciaDto
{
    public long Id { get; set; }
    public string? Tipo { get; set; }
    public string? CodigoRegistro { get; set; }
    public string? Origen { get; set; }
    public string? NroOficio { get; set; }
    public string? Referencia { get; set; }
    public string? Remitente { get; set; }
    public string? Seccion { get; set; }
    public DateTime? FechaHora { get; set; }
    public string? Firma { get; set; }
    public string? TiempoRespuesta { get; set; }
}