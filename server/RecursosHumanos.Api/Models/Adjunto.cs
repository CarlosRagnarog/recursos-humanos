using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("adjuntos")]
public class Adjunto
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("filename")]
    public string? Filename { get; set; }

    [Column("mime")]
    public string? Mime { get; set; }

    [Column("size")]
    public int? Size { get; set; }

    [Column("url")]
    public string? Url { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}