using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("usuario_rol")]
public class UsuarioRol
{
    [Column("usuario_id")]
    public Guid UsuarioId { get; set; }

    [Column("rol_id")]
    public Guid RolId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Usuario? Usuario { get; set; }
    public Rol? Rol { get; set; }
}