using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecursosHumanos.Api.Models;

[Table("personal")]
public class Personal
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; }

    [Column("escalafon")]
    public string? Escalafon { get; set; }

    [Column("primer_nombre")]
    public string? PrimerNombre { get; set; }

    [Column("segundo_nombre")]
    public string? SegundoNombre { get; set; }

    [Column("ap_paterno")]
    public string? ApPaterno { get; set; }

    [Column("ap_materno")]
    public string? ApMaterno { get; set; }

    [Column("ap_esposo")]
    public string? ApEsposo { get; set; }

    [Column("grado_id")]
    public int? GradoId { get; set; }

    [Column("ci")]
    public string? Ci { get; set; }

    [Column("exp")]
    public string? Exp { get; set; }

    [Column("genero")]
    public string? Genero { get; set; }

    [Column("altura_cm")]
    public decimal? AlturaCm { get; set; }

    [Column("peso_kg")]
    public decimal? PesoKg { get; set; }

    [Column("foto_url")]
    public string? FotoUrl { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [Column("deleted_at")]
    public DateTime? DeletedAt { get; set; }

    public Grado? Grado { get; set; }

    public InfoPersonal? InfoPersonal { get; set; }

    public ICollection<ContactoEmergencia> ContactosEmergencia { get; set; } = new List<ContactoEmergencia>();

    public ICollection<Dependiente> Dependientes { get; set; } = new List<Dependiente>();

    public ICollection<PersonalEspecialidad> PersonalEspecialidades { get; set; } = new List<PersonalEspecialidad>();
}