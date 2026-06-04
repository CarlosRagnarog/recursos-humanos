using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("comisiones")]
public class Comision
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

    [Column("nro_memo")]
    public string? NroMemo { get; set; }

    [Column("desde")]
    public DateOnly? Desde { get; set; }

    [Column("hasta")]
    public DateOnly? Hasta { get; set; }

    [Column("unidad_org")]
    public string? UnidadOrg { get; set; }

    [Column("autoridad_firma")]
    public string? AutoridadFirma { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}