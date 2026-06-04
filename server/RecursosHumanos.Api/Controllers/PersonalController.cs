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
}