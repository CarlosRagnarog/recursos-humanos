using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("contactos_emergencia")]
public class ContactoEmergencia
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("personal_id")]
    public Guid PersonalId { get; set; }

    [Column("nombres")]
    public string? Nombres { get; set; }

    [Column("apellidos")]
    public string? Apellidos { get; set; }

    [Column("telefono")]
    public string? Telefono { get; set; }

    [Column("celular")]
    public string? Celular { get; set; }

    [Column("direccion")]
    public string? Direccion { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}