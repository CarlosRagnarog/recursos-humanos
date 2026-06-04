using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("situaciones")]
public class Situacion
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("personal_id")]
    public Guid PersonalId { get; set; }

    [Column("tipo")]
    public string? Tipo { get; set; }

    [Column("causal")]
    public string? Causal { get; set; }

    [Column("fecha_inicio")]
    public DateOnly? FechaInicio { get; set; }

    [Column("fecha_retorno")]
    public DateOnly? FechaRetorno { get; set; }

    [Column("situacion_actual")]
    public string? SituacionActual { get; set; }

    [Column("observaciones")]
    public string? Observaciones { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}