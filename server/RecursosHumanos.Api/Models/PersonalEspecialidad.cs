using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("personal_especialidad")]
public class PersonalEspecialidad
{
    [Column("personal_id")]
    public Guid PersonalId { get; set; }

    [Column("especialidad_id")]
    public Guid EspecialidadId { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Personal? Personal { get; set; }
    public Especialidad? Especialidad { get; set; }
}