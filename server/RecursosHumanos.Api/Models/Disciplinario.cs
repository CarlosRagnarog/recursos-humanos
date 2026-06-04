using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("disciplinario")]
public class Disciplinario
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

    [Column("fecha")]
    public DateOnly? Fecha { get; set; }

    [Column("causal")]
    public string? Causal { get; set; }

    [Column("observaciones")]
    public string? Observaciones { get; set; }

    [Column("autoridad_firma")]
    public string? AutoridadFirma { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}