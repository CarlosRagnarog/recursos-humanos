namespace RecursosHumanos.Api.DTOs;

public class MeritoDemeritoDto
{
    public long Id { get; set; }
    public Guid PersonalId { get; set; }
    public string Tipo { get; set; } = string.Empty;

    public string? Nro { get; set; }
    public string? NroFolio { get; set; }
    public string? NroMemo { get; set; }

    public DateOnly? Fecha { get; set; }
    public DateOnly? Desde { get; set; }
    public DateOnly? Hasta { get; set; }

    public int? Dias { get; set; }

    public string? UnidadAnterior { get; set; }
    public string? UnidadActual { get; set; }
    public string? CargoActual { get; set; }
    public string? EstadoPersonal { get; set; }

    public string? UnidadOrg { get; set; }
    public string? InstitucionMedica { get; set; }
    public string? Causal { get; set; }
    public string? Motivo { get; set; }
    public string? Designacion { get; set; }
    public string? Destino { get; set; }
    public string? NroPasaporte { get; set; }

    public string? Observaciones { get; set; }
    public string? AutoridadFirma { get; set; }
}