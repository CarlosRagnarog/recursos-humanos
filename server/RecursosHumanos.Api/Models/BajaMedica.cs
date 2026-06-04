using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("bajas_medicas")]
public class BajaMedica
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("personal_id")]
    public Guid PersonalId { get; set; }

    [Column("nro")]
    public string? Nro { get; set; }

    [Column("nro_folio")]
    public string? NroFolio { get; set; }

    [Column("desde")]
    public DateOnly? Desde { get; set; }

    [Column("hasta")]
    public DateOnly? Hasta { get; set; }

    [Column("institucion_medica")]
    public string? InstitucionMedica { get; set; }

    [Column("observaciones")]
    public string? Observaciones { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}