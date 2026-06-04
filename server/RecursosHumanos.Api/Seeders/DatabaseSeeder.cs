using RecursosHumanos.Api.Data;
using RecursosHumanos.Api.Models;

namespace RecursosHumanos.Api.Seeders;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (!context.Grados.Any())
        {
            context.Grados.AddRange(
                new Grado { Nombre = "Sin grado", Orden = 0 },
                new Grado { Nombre = "Sargento", Orden = 1 },
                new Grado { Nombre = "Suboficial", Orden = 2 },
                new Grado { Nombre = "Teniente", Orden = 3 },
                new Grado { Nombre = "Capitán", Orden = 4 },
                new Grado { Nombre = "Mayor", Orden = 5 },
                new Grado { Nombre = "Coronel", Orden = 6 }
            );
        }

        if (!context.Roles.Any())
        {
            var adminRol = new Rol
            {
                Id = Guid.NewGuid(),
                Nombre = "ADMIN",
                Descripcion = "Administrador del sistema"
            };

            var rrhhRol = new Rol
            {
                Id = Guid.NewGuid(),
                Nombre = "RRHH",
                Descripcion = "Gestión de recursos humanos"
            };

            context.Roles.AddRange(adminRol, rrhhRol);

            var adminUser = new Usuario
            {
                Id = Guid.NewGuid(),
                Username = "Administrador",
                Email = "admin@rrhh.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123"),
                Activo = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Usuarios.Add(adminUser);

            context.UsuarioRoles.Add(new UsuarioRol
            {
                UsuarioId = adminUser.Id,
                RolId = adminRol.Id,
                CreatedAt = DateTime.UtcNow
            });
        }

        await context.SaveChangesAsync();
    }
}