using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("reclamaciones")]
public class Reclamacion
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("personal_id")]
    public Guid PersonalId { get; set; }

    [Column("tipo")]
    public string? Tipo { get; set; }

    [Column("fecha")]
    public DateOnly? Fecha { get; set; }

    [Column("unidad_representada")]
    public string? UnidadRepresentada { get; set; }

    [Column("nro_memorandum")]
    public string? NroMemorandum { get; set; }

    [Column("observaciones")]
    public string? Observaciones { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}