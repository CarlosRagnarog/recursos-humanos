using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("audit_logs")]
public class AuditLog
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Column("actor_id")]
    public Guid? ActorId { get; set; }

    [Column("entidad")]
    public string? Entidad { get; set; }

    [Column("entidad_id")]
    public string? EntidadId { get; set; }

    [Column("accion")]
    public string? Accion { get; set; }

    [Column("payload")]
    public string? Payload { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Usuario? Actor { get; set; }
}