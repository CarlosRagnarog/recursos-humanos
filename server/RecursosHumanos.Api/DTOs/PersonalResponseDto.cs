namespace RecursosHumanos.Api.DTOs;

public class PersonalResponseDto
{
    public Guid Id { get; set; }
    public string? Escalafon { get; set; }
    public string? PrimerNombre { get; set; }
    public string? SegundoNombre { get; set; }
    public string? ApPaterno { get; set; }
    public string? ApMaterno { get; set; }
    public string? ApEsposo { get; set; }
    public int? GradoId { get; set; }
    public string? Grado { get; set; }
    public string? Ci { get; set; }
    public string? Exp { get; set; }
    public string? Genero { get; set; }
    public decimal? AlturaCm { get; set; }
    public decimal? PesoKg { get; set; }
    public string? FotoUrl { get; set; }
}