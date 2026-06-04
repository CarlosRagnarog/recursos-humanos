using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("info_personal")]
public class InfoPersonal
{
    [Key]
    [Column("personal_id")]
    public Guid PersonalId { get; set; }

    [Column("estado_civil")]
    public string? EstadoCivil { get; set; }

    [Column("f_nac")]
    public DateOnly? FechaNacimiento { get; set; }

    [Column("grupo_sanguineo")]
    public string? GrupoSanguineo { get; set; }

    [Column("f_ingreso")]
    public DateOnly? FechaIngreso { get; set; }

    [Column("tel_cel")]
    public string? TelCel { get; set; }

    [Column("tel_part")]
    public string? TelPart { get; set; }

    [Column("direccion")]
    public string? Direccion { get; set; }

    [Column("zona")]
    public string? Zona { get; set; }

    [Column("sigep")]
    public string? Sigep { get; set; }

    [Column("email")]
    public string? Email { get; set; }

    public Personal? Personal { get; set; }
}