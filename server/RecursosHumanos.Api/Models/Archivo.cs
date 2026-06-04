using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("archivos")]
public class Archivo
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("tipo")]
    public string? Tipo { get; set; }

    [Column("codigo")]
    public string? Codigo { get; set; }

    [Column("fecha")]
    public DateOnly? Fecha { get; set; }

    [Column("nombre")]
    public string? Nombre { get; set; }

    [Column("inicio")]
    public DateOnly? Inicio { get; set; }

    [Column("fin")]
    public DateOnly? Fin { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ArchivoRel> ArchivosRel { get; set; } = new List<ArchivoRel>();
}