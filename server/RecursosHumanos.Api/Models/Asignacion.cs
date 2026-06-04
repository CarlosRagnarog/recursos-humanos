using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("asignaciones")]
public class Asignacion
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("personal_id")]
    public Guid PersonalId { get; set; }

    [Column("institucion_id")]
    public Guid InstitucionId { get; set; }

    [Column("cargo")]
    public string? Cargo { get; set; }

    [Column("unidad")]
    public string? Unidad { get; set; }

    [Column("desde")]
    public DateOnly? Desde { get; set; }

    [Column("hasta")]
    public DateOnly? Hasta { get; set; }

    [Column("activo")]
    public bool Activo { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }

    public Institucion? Institucion { get; set; }
}