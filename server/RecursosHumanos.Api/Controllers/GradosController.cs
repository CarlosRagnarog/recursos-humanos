using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecursosHumanos.Api.Data;
using RecursosHumanos.Api.Models;

namespace RecursosHumanos.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GradosController : ControllerBase
{
    private readonly AppDbContext _context;

    public GradosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Grado>>> GetGrados()
    {
        return await _context.Grados
            .OrderBy(g => g.Orden)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Grado>> GetGrado(int id)
    {
        var grado = await _context.Grados.FindAsync(id);

        if (grado == null)
        {
            return NotFound(new { message = "Grado no encontrado" });
        }

        return grado;
    }

    [HttpPost]
    public async Task<ActionResult<Grado>> CreateGrado(Grado grado)
    {
        _context.Grados.Add(grado);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGrado), new { id = grado.Id }, grado);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGrado(int id, Grado grado)
    {
        if (id != grado.Id)
        {
            return BadRequest(new { message = "El ID no coincide" });
        }

        _context.Entry(grado).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGrado(int id)
    {
        var grado = await _context.Grados.FindAsync(id);

        if (grado == null)
        {
            return NotFound(new { message = "Grado no encontrado" });
        }

        _context.Grados.Remove(grado);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}