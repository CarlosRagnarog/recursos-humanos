using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("revision_juridica")]
public class RevisionJuridica
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("tipo")]
    public string? Tipo { get; set; }

    [Column("codigo")]
    public string? Codigo { get; set; }

    [Column("destino")]
    public string? Destino { get; set; }

    [Column("origen")]
    public string? Origen { get; set; }

    [Column("fecha")]
    public DateOnly? Fecha { get; set; }

    [Column("motivo")]
    public string? Motivo { get; set; }

    [Column("recepcion")]
    public string? Recepcion { get; set; }

    [Column("fecha_hora")]
    public DateTime? FechaHora { get; set; }

    [Column("firma")]
    public string? Firma { get; set; }

    [Column("entrega")]
    public string? Entrega { get; set; }

    [Column("personal_id")]
    public Guid? PersonalId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}