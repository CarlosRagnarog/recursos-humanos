using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("roles")]
public class Rol
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("nombre")]
    public string? Nombre { get; set; }

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    public ICollection<UsuarioRol> UsuarioRoles { get; set; } = new List<UsuarioRol>();
}