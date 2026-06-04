using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecursosHumanos.Api.Data;
using RecursosHumanos.Api.DTOs;
using RecursosHumanos.Api.Models;

namespace RecursosHumanos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PersonalController : ControllerBase
{
    private readonly AppDbContext _context;

    public PersonalController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonalResponseDto>>> GetPersonal()
    {
        var personal = await _context.Personal
            .Include(p => p.Grado)
            .Where(p => p.DeletedAt == null)
            .OrderBy(p => p.ApPaterno)
            .Select(p => new PersonalResponseDto
            {
                Id = p.Id,
                Escalafon = p.Escalafon,
                PrimerNombre = p.PrimerNombre,
                SegundoNombre = p.SegundoNombre,
                ApPaterno = p.ApPaterno,
                ApMaterno = p.ApMaterno,
                ApEsposo = p.ApEsposo,
                GradoId = p.GradoId,
                Grado = p.Grado != null ? p.Grado.Nombre : null,
                Ci = p.Ci,
                Exp = p.Exp,
                Genero = p.Genero,
                AlturaCm = p.AlturaCm,
                PesoKg = p.PesoKg,
                FotoUrl = p.FotoUrl
            })
            .ToListAsync();

        return Ok(personal);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PersonalResponseDto>> GetPersonalById(Guid id)
    {
        var personal = await _context.Personal
            .Include(p => p.Grado)
            .Where(p => p.Id == id && p.DeletedAt == null)
            .Select(p => new PersonalResponseDto
            {
                Id = p.Id,
                Escalafon = p.Escalafon,
                PrimerNombre = p.PrimerNombre,
                SegundoNombre = p.SegundoNombre,
                ApPaterno = p.ApPaterno,
                ApMaterno = p.ApMaterno,
                ApEsposo = p.ApEsposo,
                GradoId = p.GradoId,
                Grado = p.Grado != null ? p.Grado.Nombre : null,
                Ci = p.Ci,
                Exp = p.Exp,
                Genero = p.Genero,
                AlturaCm = p.AlturaCm,
                PesoKg = p.PesoKg,
                FotoUrl = p.FotoUrl
            })
            .FirstOrDefaultAsync();

        if (personal == null)
        {
            return NotFound(new { message = "Personal no encontrado" });
        }

        return Ok(personal);
    }

    [HttpPost]
    public async Task<ActionResult<PersonalResponseDto>> CreatePersonal([FromBody] PersonalCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Ci))
        {
            return BadRequest(new { message = "El C.I. es obligatorio" });
        }

        var existeCi = await _context.Personal
            .AnyAsync(p => p.Ci == dto.Ci && p.DeletedAt == null);

        if (existeCi)
        {
            return Conflict(new { message = "Ya existe el efectivo policial con ese C.I." });
        }
        var personal = new Personal
        {
            Id = Guid.NewGuid(),
            Escalafon = dto.Escalafon,
            PrimerNombre = dto.PrimerNombre,
            SegundoNombre = dto.SegundoNombre,
            ApPaterno = dto.ApPaterno,
            ApMaterno = dto.ApMaterno,
            ApEsposo = dto.ApEsposo,
            GradoId = dto.GradoId,
            Ci = dto.Ci,
            Exp = dto.Exp,
            Genero = dto.Genero,
            AlturaCm = dto.AlturaCm,
            PesoKg = dto.PesoKg,
            FotoUrl = dto.FotoUrl,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Personal.Add(personal);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPersonalById), new { id = personal.Id }, personal);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePersonal(Guid id, [FromBody] PersonalCreateDto dto)
    {
        var personal = await _context.Personal.FindAsync(id);

        if (personal == null || personal.DeletedAt != null)
        {
            return NotFound(new { message = "Personal no encontrado" });
        }

        personal.Escalafon = dto.Escalafon;
        personal.PrimerNombre = dto.PrimerNombre;
        personal.SegundoNombre = dto.SegundoNombre;
        personal.ApPaterno = dto.ApPaterno;
        personal.ApMaterno = dto.ApMaterno;
        personal.ApEsposo = dto.ApEsposo;
        personal.GradoId = dto.GradoId;
        personal.Ci = dto.Ci;
        personal.Exp = dto.Exp;
        personal.Genero = dto.Genero;
        personal.AlturaCm = dto.AlturaCm;
        personal.PesoKg = dto.PesoKg;
        personal.FotoUrl = dto.FotoUrl;
        personal.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePersonal(Guid id)
    {
        var personal = await _context.Personal.FindAsync(id);

        if (personal == null || personal.DeletedAt != null)
        {
            return NotFound(new { message = "Personal no encontrado" });
        }

        personal.DeletedAt = DateTime.UtcNow;
        personal.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();

    }
    [HttpPost("registro-completo")]
    public async Task<IActionResult> CreateRegistroCompleto([FromBody] PersonalRegistroCompletoDto dto)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var personal = new Personal
            {
                Id = Guid.NewGuid(),
                Escalafon = dto.Escalafon,
                PrimerNombre = dto.PrimerNombre,
                SegundoNombre = dto.SegundoNombre,
                ApPaterno = dto.ApPaterno,
                ApMaterno = dto.ApMaterno,
                ApEsposo = dto.ApEsposo,
                GradoId = dto.GradoId,
                Ci = dto.Ci,
                Exp = dto.Exp,
                Genero = dto.Genero,
                AlturaCm = dto.AlturaCm,
                PesoKg = dto.PesoKg,
                FotoUrl = dto.FotoUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Personal.Add(personal);

            _context.InfoPersonal.Add(new InfoPersonal
            {
                PersonalId = personal.Id,
                EstadoCivil = dto.EstadoCivil,
                FechaNacimiento = dto.FechaNacimiento,
                GrupoSanguineo = dto.GrupoSanguineo,
                FechaIngreso = dto.FechaIngreso,
                TelCel = dto.TelCel,
                TelPart = dto.TelPart,
                Direccion = dto.Direccion,
                Zona = dto.Zona,
                Sigep = dto.Sigep,
                Email = dto.Email
            });

            if (!string.IsNullOrWhiteSpace(dto.EmergenciaNombres))
            {
                _context.ContactosEmergencia.Add(new ContactoEmergencia
                {
                    PersonalId = personal.Id,
                    Nombres = dto.EmergenciaNombres,
                    Apellidos = dto.EmergenciaApellidos,
                    Telefono = dto.EmergenciaTelefono,
                    Celular = dto.EmergenciaCelular,
                    Direccion = dto.EmergenciaDireccion,
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (!string.IsNullOrWhiteSpace(dto.DependienteNombres))
            {
                _context.Dependientes.Add(new Dependiente
                {
                    PersonalId = personal.Id,
                    Tipo = dto.DependienteTipo,
                    Nombres = dto.DependienteNombres,
                    Apellidos = dto.DependienteApellidos,
                    Celular = dto.DependienteCelular,
                    Direccion = dto.DependienteDireccion,
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (!string.IsNullOrWhiteSpace(dto.EspecialidadTexto))
            {
                var especialidad = new Especialidad
                {
                    Id = Guid.NewGuid(),
                    Nombre = dto.EspecialidadTexto,
                    Tipo = "Personal",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Especialidades.Add(especialidad);

                _context.PersonalEspecialidades.Add(new PersonalEspecialidad
                {
                    PersonalId = personal.Id,
                    EspecialidadId = especialidad.Id,
                    CreatedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new
            {
                message = "Personal registrado correctamente",
                id = personal.Id
            });
        }
        catch
        {
            await transaction.RollbackAsync();
            return BadRequest(new { message = "Error al registrar personal" });
        }
    }

    [HttpGet("registro-completo/{id}")]
    public async Task<ActionResult<PersonalRegistroCompletoResponseDto>> GetRegistroCompleto(Guid id)
    {
        var personal = await _context.Personal
            .Include(p => p.Grado)
            .Include(p => p.InfoPersonal)
            .Include(p => p.ContactosEmergencia)
            .Include(p => p.Dependientes)
            .Include(p => p.PersonalEspecialidades)
                .ThenInclude(pe => pe.Especialidad)
            .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);

        if (personal == null)
        {
            return NotFound(new { message = "Personal no encontrado" });
        }

        var emergencia = personal.ContactosEmergencia.FirstOrDefault();
        var dependiente = personal.Dependientes.FirstOrDefault();
        var especialidad = personal.PersonalEspecialidades
            .FirstOrDefault()?.Especialidad;

        return Ok(new PersonalRegistroCompletoResponseDto
        {
            Id = personal.Id,
            Escalafon = personal.Escalafon,
            PrimerNombre = personal.PrimerNombre,
            SegundoNombre = personal.SegundoNombre,
            ApPaterno = personal.ApPaterno,
            ApMaterno = personal.ApMaterno,
            ApEsposo = personal.ApEsposo,
            GradoId = personal.GradoId,
            Grado = personal.Grado != null ? personal.Grado.Nombre : null,
            Ci = personal.Ci,
            Exp = personal.Exp,
            Genero = personal.Genero,
            AlturaCm = personal.AlturaCm,
            PesoKg = personal.PesoKg,
            FotoUrl = personal.FotoUrl,

            EstadoCivil = personal.InfoPersonal?.EstadoCivil,
            FechaNacimiento = personal.InfoPersonal?.FechaNacimiento,
            GrupoSanguineo = personal.InfoPersonal?.GrupoSanguineo,
            FechaIngreso = personal.InfoPersonal?.FechaIngreso,
            TelCel = personal.InfoPersonal?.TelCel,
            TelPart = personal.InfoPersonal?.TelPart,
            Direccion = personal.InfoPersonal?.Direccion,
            Zona = personal.InfoPersonal?.Zona,
            Sigep = personal.InfoPersonal?.Sigep,
            Email = personal.InfoPersonal?.Email,

            EmergenciaNombres = emergencia?.Nombres,
            EmergenciaApellidos = emergencia?.Apellidos,
            EmergenciaTelefono = emergencia?.Telefono,
            EmergenciaCelular = emergencia?.Celular,
            EmergenciaDireccion = emergencia?.Direccion,

            DependienteTipo = dependiente?.Tipo,
            DependienteNombres = dependiente?.Nombres,
            DependienteApellidos = dependiente?.Apellidos,
            DependienteCelular = dependiente?.Celular,
            DependienteDireccion = dependiente?.Direccion,

            EspecialidadTexto = especialidad?.Nombre
        });
    }
    [HttpPut("datos-complementarios/{id}")]
public async Task<IActionResult> UpdateDatosComplementarios(Guid id, [FromBody] PersonalRegistroCompletoDto dto)
{
    var personal = await _context.Personal
        .Include(p => p.InfoPersonal)
        .Include(p => p.ContactosEmergencia)
        .Include(p => p.Dependientes)
        .Include(p => p.PersonalEspecialidades)
            .ThenInclude(pe => pe.Especialidad)
        .FirstOrDefaultAsync(p => p.Id == id && p.DeletedAt == null);

    if (personal == null)
    {
        return NotFound(new { message = "Personal no encontrado" });
    }

    if (personal.InfoPersonal == null)
    {
        personal.InfoPersonal = new InfoPersonal
        {
            PersonalId = personal.Id
        };

        _context.InfoPersonal.Add(personal.InfoPersonal);
    }

    personal.InfoPersonal.EstadoCivil = dto.EstadoCivil;
    personal.InfoPersonal.FechaNacimiento = dto.FechaNacimiento;
    personal.InfoPersonal.GrupoSanguineo = dto.GrupoSanguineo;
    personal.InfoPersonal.FechaIngreso = dto.FechaIngreso;
    personal.InfoPersonal.TelCel = dto.TelCel;
    personal.InfoPersonal.TelPart = dto.TelPart;
    personal.InfoPersonal.Direccion = dto.Direccion;
    personal.InfoPersonal.Zona = dto.Zona;
    personal.InfoPersonal.Sigep = dto.Sigep;
    personal.InfoPersonal.Email = dto.Email;

    var emergencia = personal.ContactosEmergencia.FirstOrDefault();

    if (emergencia == null)
    {
        emergencia = new ContactoEmergencia
        {
            PersonalId = personal.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.ContactosEmergencia.Add(emergencia);
    }

    emergencia.Nombres = dto.EmergenciaNombres;
    emergencia.Apellidos = dto.EmergenciaApellidos;
    emergencia.Telefono = dto.EmergenciaTelefono;
    emergencia.Celular = dto.EmergenciaCelular;
    emergencia.Direccion = dto.EmergenciaDireccion;

    var dependiente = personal.Dependientes.FirstOrDefault();

    if (dependiente == null)
    {
        dependiente = new Dependiente
        {
            PersonalId = personal.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.Dependientes.Add(dependiente);
    }

    dependiente.Tipo = dto.DependienteTipo;
    dependiente.Nombres = dto.DependienteNombres;
    dependiente.Apellidos = dto.DependienteApellidos;
    dependiente.Celular = dto.DependienteCelular;
    dependiente.Direccion = dto.DependienteDireccion;

    var personalEspecialidad = personal.PersonalEspecialidades.FirstOrDefault();

    if (!string.IsNullOrWhiteSpace(dto.EspecialidadTexto))
    {
        if (personalEspecialidad == null)
        {
            var especialidad = new Especialidad
            {
                Id = Guid.NewGuid(),
                Nombre = dto.EspecialidadTexto,
                Tipo = "Personal",
                CreatedAt = DateTime.UtcNow
            };

            _context.Especialidades.Add(especialidad);

            _context.PersonalEspecialidades.Add(new PersonalEspecialidad
            {
                PersonalId = personal.Id,
                EspecialidadId = especialidad.Id,
                CreatedAt = DateTime.UtcNow
            });
        }
        else if (personalEspecialidad.Especialidad != null)
        {
            personalEspecialidad.Especialidad.Nombre = dto.EspecialidadTexto;
        }
    }

    personal.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return Ok(new { message = "Datos personales actualizados correctamente" });
}
}
    
