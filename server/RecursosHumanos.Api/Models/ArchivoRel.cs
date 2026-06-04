using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("archivos_rel")]
public class ArchivoRel
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("entity_type")]
    public string? EntityType { get; set; }

    [Column("entity_id")]
    public string? EntityId { get; set; }

    [Column("archivo_id")]
    public long ArchivoId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Archivo? Archivo { get; set; }
}