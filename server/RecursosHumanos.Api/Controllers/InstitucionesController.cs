using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecursosHumanos.Api.Data;
using RecursosHumanos.Api.DTOs;
using RecursosHumanos.Api.Models;

namespace RecursosHumanos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class InstitucionesController : ControllerBase
{
    private readonly AppDbContext _context;

    public InstitucionesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InstitucionDto>>> Get()
    {
        var data = await _context.Instituciones
            .OrderBy(x => x.Nombre)
            .Select(x => new InstitucionDto
            {
                Id = x.Id,
                Nombre = x.Nombre,
                Sigla = x.Sigla,
                Tipo = x.Tipo,
                Activo = x.Activo,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();

        return Ok(data);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InstitucionDto>> GetById(Guid id)
    {
        var item = await _context.Instituciones
            .Where(x => x.Id == id)
            .Select(x => new InstitucionDto
            {
                Id = x.Id,
                Nombre = x.Nombre,
                Sigla = x.Sigla,
                Tipo = x.Tipo,
                Activo = x.Activo,
                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (item == null)
        {
            return NotFound(new { message = "Institución no encontrada" });
        }

        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] InstitucionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
        {
            return BadRequest(new { message = "El nombre de la institución es obligatorio" });
        }

        var existe = await _context.Instituciones
            .AnyAsync(x => x.Nombre!.ToLower() == dto.Nombre.ToLower());

        if (existe)
        {
            return BadRequest(new { message = "Ya existe una institución con ese nombre" });
        }

        var item = new Institucion
        {
            Id = Guid.NewGuid(),
            Nombre = dto.Nombre,
            Sigla = dto.Sigla,
            Tipo = dto.Tipo,
            Activo = dto.Activo,
            CreatedAt = DateTime.UtcNow
        };

        _context.Instituciones.Add(item);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Institución registrada correctamente" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] InstitucionDto dto)
    {
        var item = await _context.Instituciones.FindAsync(id);

        if (item == null)
        {
            return NotFound(new { message = "Institución no encontrada" });
        }

        if (string.IsNullOrWhiteSpace(dto.Nombre))
        {
            return BadRequest(new { message = "El nombre de la institución es obligatorio" });
        }

        var existe = await _context.Instituciones
            .AnyAsync(x => x.Id != id && x.Nombre!.ToLower() == dto.Nombre.ToLower());

        if (existe)
        {
            return BadRequest(new { message = "Ya existe otra institución con ese nombre" });
        }

        item.Nombre = dto.Nombre;
        item.Sigla = dto.Sigla;
        item.Tipo = dto.Tipo;
        item.Activo = dto.Activo;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Institución modificada correctamente" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var item = await _context.Instituciones.FindAsync(id);

        if (item == null)
        {
            return NotFound(new { message = "Institución no encontrada" });
        }

        _context.Instituciones.Remove(item);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Institución eliminada correctamente" });
    }
}