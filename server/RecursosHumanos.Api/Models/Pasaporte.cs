using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("pasaportes")]
public class Pasaporte
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("personal_id")]
    public Guid PersonalId { get; set; }

    [Column("nro_folio")]
    public string? NroFolio { get; set; }

    [Column("nro_pasaporte")]
    public string? NroPasaporte { get; set; }

    [Column("dias")]
    public int? Dias { get; set; }

    [Column("fecha_salida")]
    public DateOnly? FechaSalida { get; set; }

    [Column("fecha_llegada")]
    public DateOnly? FechaLlegada { get; set; }

    [Column("destino")]
    public string? Destino { get; set; }

    [Column("motivo")]
    public string? Motivo { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
}