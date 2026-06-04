namespace RecursosHumanos.Api.DTOs;

public class SituacionAdministrativaDto
{
    public Guid PersonalId { get; set; }

    // Destino
    public string? UnidadAnterior { get; set; }
    public string? UnidadActual { get; set; }
    public string? CargoActual { get; set; }
    public string? MemoNro { get; set; }
    public DateOnly? FechaDestino { get; set; }
    public string? EstadoPersonal { get; set; }
    public string? ObservacionesDestino { get; set; }

    // Situación
    public string? TipoSituacion { get; set; }
    public string? Causal { get; set; }
    public DateOnly? FechaInicio { get; set; }
    public DateOnly? FechaRetorno { get; set; }
    public string? SituacionActual { get; set; }
    public string? ObservacionesSituacion { get; set; }

    // Baja
    public DateOnly? FechaBaja { get; set; }
    public string? MotivoBaja { get; set; }
    public string? ObservacionesBaja { get; set; }

    // Reclamación
    public string? TipoReclamacion { get; set; }
    public DateOnly? FechaReclamacion { get; set; }
    public string? UnidadRepresentada { get; set; }
    public string? NroMemorandum { get; set; }
    public string? ObservacionesReclamacion { get; set; }
}