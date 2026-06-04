using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("dependientes")]
public class Dependiente
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("personal_id")]
    public Guid PersonalId { get; set; }

    [Column("tipo")]
    public string? Tipo { get; set; }

    [Column("nombres")]
    public string? Nombres { get; set; }

    [Column("apellidos")]
    public string? Apellidos { get; set; }

    [Column("celular")]
    public string? Celular { get; set; }

    [Column("direccion")]
    public string? Direccion { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}
