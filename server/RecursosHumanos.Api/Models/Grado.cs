using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("grados")]
public class Grado
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("nombre")]
    public string? Nombre { get; set; }

    [Column("orden")]
    public int Orden { get; set; }

    public ICollection<Personal> Personal { get; set; } = new List<Personal>();
}