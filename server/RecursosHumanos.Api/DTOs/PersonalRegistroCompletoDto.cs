namespace RecursosHumanos.Api.DTOs;

public class PersonalRegistroCompletoDto
{
    public string? Escalafon { get; set; }
    public string? PrimerNombre { get; set; }
    public string? SegundoNombre { get; set; }
    public string? ApPaterno { get; set; }
    public string? ApMaterno { get; set; }
    public string? ApEsposo { get; set; }
    public int? GradoId { get; set; }
    public string? Ci { get; set; }
    public string? Exp { get; set; }
    public string? Genero { get; set; }
    public decimal? AlturaCm { get; set; }
    public decimal? PesoKg { get; set; }
    public string? FotoUrl { get; set; }

    public string? EstadoCivil { get; set; }
    public DateOnly? FechaNacimiento { get; set; }
    public string? GrupoSanguineo { get; set; }
    public DateOnly? FechaIngreso { get; set; }
    public string? TelCel { get; set; }
    public string? TelPart { get; set; }
    public string? Direccion { get; set; }
    public string? Zona { get; set; }
    public string? Sigep { get; set; }
    public string? Email { get; set; }

    public string? EmergenciaNombres { get; set; }
    public string? EmergenciaApellidos { get; set; }
    public string? EmergenciaTelefono { get; set; }
    public string? EmergenciaCelular { get; set; }
    public string? EmergenciaDireccion { get; set; }

    public string? DependienteTipo { get; set; }
    public string? DependienteNombres { get; set; }
    public string? DependienteApellidos { get; set; }
    public string? DependienteCelular { get; set; }
    public string? DependienteDireccion { get; set; }

    public string? EspecialidadTexto { get; set; }
}