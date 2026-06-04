using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("destinos")]
public class Destino
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("personal_id")]
    public Guid PersonalId { get; set; }

    [Column("unidad_anterior")]
    public string? UnidadAnterior { get; set; }

    [Column("unidad_actual")]
    public string? UnidadActual { get; set; }

    [Column("cargo_actual")]
    public string? CargoActual { get; set; }

    [Column("memo_nro")]
    public string? MemoNro { get; set; }

    [Column("fecha_destino")]
    public DateOnly? FechaDestino { get; set; }

    [Column("estado_personal")]
    public string? EstadoPersonal { get; set; }

    [Column("observaciones")]
    public string? Observaciones { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}