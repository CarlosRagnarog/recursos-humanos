namespace RecursosHumanos.Api.DTOs;

public class RevisionJuridicaDto
{
    public long Id { get; set; }
    public string? Tipo { get; set; }
    public string? Codigo { get; set; }
    public string? Destino { get; set; }
    public string? Origen { get; set; }
    public DateOnly? Fecha { get; set; }
    public DateTime? FechaHora { get; set; }
    public string? Motivo { get; set; }
    public string? Recepcion { get; set; }
    public string? Firma { get; set; }
    public string? Entrega { get; set; }
    public DateTime CreatedAt { get; set; }
}