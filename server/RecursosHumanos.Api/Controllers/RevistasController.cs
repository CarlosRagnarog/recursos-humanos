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
public class RevistasController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _env;

    public RevistasController(AppDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpGet("{personalId}")]
    public async Task<IActionResult> GetByPersonal(Guid personalId)
    {
        var data = await _context.ArchivosRel
            .Include(x => x.Archivo)
            .Where(x => x.EntityType == "lista_revista" && x.EntityId == personalId.ToString())
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new RevistaDto
            {
                Id = x.Id,
                PersonalId = personalId,
                Nombre = x.Archivo != null ? x.Archivo.Nombre : "",
                Informacion = x.Archivo != null ? x.Archivo.Codigo : "",
                ArchivoUrl = x.Archivo != null ? x.Archivo.Tipo : "",
                ArchivoNombre = x.Archivo != null ? x.Archivo.Nombre : "",
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();

        return Ok(data);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] Guid personalId, [FromForm] string nombre, [FromForm] string? informacion, [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Debe seleccionar un archivo" });

        var personalExiste = await _context.Personal.AnyAsync(p => p.Id == personalId && p.DeletedAt == null);

        if (!personalExiste)
            return NotFound(new { message = "Personal no encontrado" });

        var uploadsPath = Path.Combine(_env.WebRootPath, "uploads", "revistas");

        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsPath, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        var url = $"/uploads/revistas/{fileName}";

        var archivo = new Archivo
        {
            Tipo = url,
            Codigo = informacion,
            Nombre = nombre,
            Fecha = DateOnly.FromDateTime(DateTime.UtcNow),
            CreatedAt = DateTime.UtcNow
        };

        _context.Archivos.Add(archivo);
        await _context.SaveChangesAsync();

        var rel = new ArchivoRel
        {
            EntityType = "lista_revista",
            EntityId = personalId.ToString(),
            ArchivoId = archivo.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.ArchivosRel.Add(rel);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Revista registrada correctamente" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromForm] string nombre, [FromForm] string? informacion, [FromForm] IFormFile? file)
    {
        var rel = await _context.ArchivosRel
            .Include(x => x.Archivo)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (rel == null || rel.Archivo == null)
            return NotFound(new { message = "Registro no encontrado" });

        rel.Archivo.Nombre = nombre;
        rel.Archivo.Codigo = informacion;

        if (file != null && file.Length > 0)
        {
            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads", "revistas");

            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var extension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsPath, fileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            rel.Archivo.Tipo = $"/uploads/revistas/{fileName}";
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Revista modificada correctamente" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var rel = await _context.ArchivosRel
            .Include(x => x.Archivo)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (rel == null)
            return NotFound(new { message = "Registro no encontrado" });

        if (rel.Archivo != null)
            _context.Archivos.Remove(rel.Archivo);

        _context.ArchivosRel.Remove(rel);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Revista eliminada correctamente" });
    }
}