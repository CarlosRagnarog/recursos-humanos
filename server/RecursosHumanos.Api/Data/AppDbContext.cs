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
    }
}