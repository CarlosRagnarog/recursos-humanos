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
public class CorrespondenciaController : ControllerBase
{
    private readonly AppDbContext _context;

    public CorrespondenciaController(AppDbContext context)
    {
        _context = context;
    }

    private static DateTime? ConvertirFechaUtc(DateTime? fecha)
    {
        if (!fecha.HasValue)
        {
            return null;
        }

        return DateTime.SpecifyKind(fecha.Value, DateTimeKind.Local).ToUniversalTime();
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var data = await _context.Correspondencias
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new CorrespondenciaDto
            {
                Id = x.Id,
                Tipo = x.Tipo,
                CodigoRegistro = x.CodigoRegistro,
                Origen = x.Origen,
                NroOficio = x.NroOficio,
                Referencia = x.Referencia,
                Remitente = x.Remitente,
                Seccion = x.Seccion,
                FechaHora = x.FechaHora,
                Firma = x.Firma,
                TiempoRespuesta = x.TiempoRespuesta
            })
            .ToListAsync();

        return Ok(data);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CorrespondenciaDto dto)
    {
        var item = new Correspondencia
        {
            Tipo = dto.Tipo,
            CodigoRegistro = dto.CodigoRegistro,
            Origen = dto.Origen,
            NroOficio = dto.NroOficio,
            Referencia = dto.Referencia,
            Remitente = dto.Remitente,
            Seccion = dto.Seccion,
            FechaHora = ConvertirFechaUtc(dto.FechaHora),
            Firma = dto.Firma,
            TiempoRespuesta = dto.TiempoRespuesta,
            CreatedAt = DateTime.UtcNow
        };

        _context.Correspondencias.Add(item);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Correspondencia registrada correctamente" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] CorrespondenciaDto dto)
    {
        var item = await _context.Correspondencias.FindAsync(id);

        if (item == null)
        {
            return NotFound(new { message = "Registro no encontrado" });
        }

        item.Tipo = dto.Tipo;
        item.CodigoRegistro = dto.CodigoRegistro;
        item.Origen = dto.Origen;
        item.NroOficio = dto.NroOficio;
        item.Referencia = dto.Referencia;
        item.Remitente = dto.Remitente;
        item.Seccion = dto.Seccion;
        item.FechaHora = ConvertirFechaUtc(dto.FechaHora);
        item.Firma = dto.Firma;
        item.TiempoRespuesta = dto.TiempoRespuesta;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Correspondencia modificada correctamente" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var item = await _context.Correspondencias.FindAsync(id);

        if (item == null)
        {
            return NotFound(new { message = "Registro no encontrado" });
        }

        _context.Correspondencias.Remove(item);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Correspondencia eliminada correctamente" });
    }
}