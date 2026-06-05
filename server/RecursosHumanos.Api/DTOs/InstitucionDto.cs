namespace RecursosHumanos.Api.DTOs;

public class InstitucionDto
{
    public Guid Id { get; set; }
    public string? Nombre { get; set; }
    public string? Sigla { get; set; }
    public string? Tipo { get; set; }
    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; }
}