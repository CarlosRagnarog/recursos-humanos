namespace RecursosHumanos.Api.DTOs;

public class RevistaDto
{
    public long Id { get; set; }
    public Guid PersonalId { get; set; }
    public string? Nombre { get; set; }
    public string? Informacion { get; set; }
    public string? ArchivoUrl { get; set; }
    public string? ArchivoNombre { get; set; }
    public string? ArchivoMime { get; set; }
    public DateTime CreatedAt { get; set; }
}