using Microsoft.EntityFrameworkCore;
using RecursosHumanos.Api.Models;

namespace RecursosHumanos.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<UsuarioRol> UsuarioRoles => Set<UsuarioRol>();
    public DbSet<Grado> Grados => Set<Grado>();
    public DbSet<Personal> Personal => Set<Personal>();

    public DbSet<Institucion> Instituciones => Set<Institucion>();
    public DbSet<Especialidad> Especialidades => Set<Especialidad>();
    public DbSet<InfoPersonal> InfoPersonal => Set<InfoPersonal>();
    public DbSet<ContactoEmergencia> ContactosEmergencia => Set<ContactoEmergencia>();
    public DbSet<Dependiente> Dependientes => Set<Dependiente>();
    public DbSet<PersonalEspecialidad> PersonalEspecialidades => Set<PersonalEspecialidad>();

    public DbSet<Asignacion> Asignaciones => Set<Asignacion>();
    public DbSet<Destino> Destinos => Set<Destino>();
    public DbSet<Situacion> Situaciones => Set<Situacion>();
    public DbSet<Baja> Bajas => Set<Baja>();
    public DbSet<Reclamacion> Reclamaciones => Set<Reclamacion>();

    public DbSet<Vacacion> Vacaciones => Set<Vacacion>();
    public DbSet<BajaMedica> BajasMedicas => Set<BajaMedica>();
    public DbSet<Comision> Comisiones => Set<Comision>();
    public DbSet<Disciplinario> Disciplinarios => Set<Disciplinario>();
    public DbSet<Felicitacion> Felicitaciones => Set<Felicitacion>();
    public DbSet<LlamadaAtencion> LlamadasAtencion => Set<LlamadaAtencion>();
    public DbSet<Designacion> Designaciones => Set<Designacion>();
    public DbSet<Pasaporte> Pasaportes => Set<Pasaporte>();
    public DbSet<Correspondencia> Correspondencias => Set<Correspondencia>();
    public DbSet<RevisionJuridica> RevisionesJuridicas => Set<RevisionJuridica>();
    public DbSet<Archivo> Archivos => Set<Archivo>();
    public DbSet<Adjunto> Adjuntos => Set<Adjunto>();
    public DbSet<ArchivoRel> ArchivosRel => Set<ArchivoRel>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasPostgresExtension("uuid-ossp");

        modelBuilder.Entity<UsuarioRol>()
            .HasKey(ur => new { ur.UsuarioId, ur.RolId });

        modelBuilder.Entity<UsuarioRol>()
            .HasOne(ur => ur.Usuario)
            .WithMany(u => u.UsuarioRoles)
            .HasForeignKey(ur => ur.UsuarioId);

        modelBuilder.Entity<UsuarioRol>()
            .HasOne(ur => ur.Rol)
            .WithMany(r => r.UsuarioRoles)
            .HasForeignKey(ur => ur.RolId);

        modelBuilder.Entity<Personal>()
            .HasOne(p => p.Grado)
            .WithMany(g => g.Personal)
            .HasForeignKey(p => p.GradoId);

        modelBuilder.Entity<InfoPersonal>()
.HasOne(i => i.Personal)
.WithOne(p => p.InfoPersonal)
.HasForeignKey<InfoPersonal>(i => i.PersonalId);

        modelBuilder.Entity<ContactoEmergencia>()
            .HasOne(c => c.Personal)
            .WithMany(p => p.ContactosEmergencia)
            .HasForeignKey(c => c.PersonalId);

        modelBuilder.Entity<Dependiente>()
            .HasOne(d => d.Personal)
            .WithMany(p => p.Dependientes)
            .HasForeignKey(d => d.PersonalId);

        modelBuilder.Entity<PersonalEspecialidad>()
            .HasKey(pe => new { pe.PersonalId, pe.EspecialidadId });

        modelBuilder.Entity<PersonalEspecialidad>()
            .HasOne(pe => pe.Personal)
            .WithMany(p => p.PersonalEspecialidades)
            .HasForeignKey(pe => pe.PersonalId);

        modelBuilder.Entity<PersonalEspecialidad>()
            .HasOne(pe => pe.Especialidad)
            .WithMany(e => e.PersonalEspecialidades)
            .HasForeignKey(pe => pe.EspecialidadId);


        modelBuilder.Entity<Asignacion>()
            .HasOne(a => a.Personal)
            .WithMany(p => p.Asignaciones)
            .HasForeignKey(a => a.PersonalId);

        modelBuilder.Entity<Asignacion>()
            .HasOne(a => a.Institucion)
            .WithMany(i => i.Asignaciones)
            .HasForeignKey(a => a.InstitucionId);

        modelBuilder.Entity<Destino>()
            .HasOne(d => d.Personal)
            .WithMany(p => p.Destinos)
            .HasForeignKey(d => d.PersonalId);

        modelBuilder.Entity<Situacion>()
            .HasOne(s => s.Personal)
            .WithMany(p => p.Situaciones)
            .HasForeignKey(s => s.PersonalId);

        modelBuilder.Entity<Baja>()
            .HasOne(b => b.Personal)
            .WithMany(p => p.Bajas)
            .HasForeignKey(b => b.PersonalId);

        modelBuilder.Entity<Reclamacion>()
            .HasOne(r => r.Personal)
            .WithMany(p => p.Reclamaciones)
            .HasForeignKey(r => r.PersonalId);

        modelBuilder.Entity<Vacacion>()
        .HasOne(v => v.Personal)
        .WithMany(p => p.Vacaciones)
        .HasForeignKey(v => v.PersonalId);

        modelBuilder.Entity<BajaMedica>()
            .HasOne(b => b.Personal)
            .WithMany(p => p.BajasMedicas)
            .HasForeignKey(b => b.PersonalId);

        modelBuilder.Entity<Comision>()
            .HasOne(c => c.Personal)
            .WithMany(p => p.Comisiones)
            .HasForeignKey(c => c.PersonalId);

        modelBuilder.Entity<Disciplinario>()
            .HasOne(d => d.Personal)
            .WithMany(p => p.Disciplinarios)
            .HasForeignKey(d => d.PersonalId);

        modelBuilder.Entity<Felicitacion>()
            .HasOne(f => f.Personal)
            .WithMany(p => p.Felicitaciones)
            .HasForeignKey(f => f.PersonalId);

        modelBuilder.Entity<LlamadaAtencion>()
            .HasOne(l => l.Personal)
            .WithMany(p => p.LlamadasAtencion)
            .HasForeignKey(l => l.PersonalId);

        modelBuilder.Entity<Designacion>()
            .HasOne(d => d.Personal)
            .WithMany(p => p.Designaciones)
            .HasForeignKey(d => d.PersonalId);

        modelBuilder.Entity<Pasaporte>()
            .HasOne(pas => pas.Personal)
            .WithMany(p => p.Pasaportes)
            .HasForeignKey(pas => pas.PersonalId);

                    modelBuilder.Entity<Correspondencia>()
            .HasOne(c => c.Personal)
            .WithMany(p => p.Correspondencias)
            .HasForeignKey(c => c.PersonalId);

        modelBuilder.Entity<RevisionJuridica>()
            .HasOne(r => r.Personal)
            .WithMany(p => p.RevisionesJuridicas)
            .HasForeignKey(r => r.PersonalId);

        modelBuilder.Entity<ArchivoRel>()
            .HasOne(ar => ar.Archivo)
            .WithMany(a => a.ArchivosRel)
            .HasForeignKey(ar => ar.ArchivoId);

        modelBuilder.Entity<AuditLog>()
            .HasOne(a => a.Actor)
            .WithMany(u => u.AuditLogs)
            .HasForeignKey(a => a.ActorId);
    }
}