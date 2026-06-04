using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("correspondencia")]
public class Correspondencia
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("tipo")]
    public string? Tipo { get; set; }

    [Column("codigo_registro")]
    public string? CodigoRegistro { get; set; }

    [Column("origen")]
    public string? Origen { get; set; }

    [Column("nro_oficio")]
    public string? NroOficio { get; set; }

    [Column("referencia")]
    public string? Referencia { get; set; }

    [Column("remitente")]
    public string? Remitente { get; set; }

    [Column("seccion")]
    public string? Seccion { get; set; }

    [Column("fecha_hora")]
    public DateTime? FechaHora { get; set; }

    [Column("firma")]
    public string? Firma { get; set; }

    [Column("tiempo_respuesta")]
    public string? TiempoRespuesta { get; set; }

    [Column("personal_id")]
    public Guid? PersonalId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}