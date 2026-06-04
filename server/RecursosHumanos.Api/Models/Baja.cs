using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("bajas")]
public class Baja
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("personal_id")]
    public Guid PersonalId { get; set; }

    [Column("fecha_baja")]
    public DateOnly? FechaBaja { get; set; }

    [Column("motivo")]
    public string? Motivo { get; set; }

    [Column("observaciones")]
    public string? Observaciones { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}