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
public class RevisionJuridicaController : ControllerBase
{
    private readonly AppDbContext _context;

    public RevisionJuridicaController(AppDbContext context)
    {
        _context = context;
    }

    private static DateTime? ConvertirFechaUtc(DateTime? fecha)
    {
        if (!fecha.HasValue) return null;

        return DateTime.SpecifyKind(fecha.Value, DateTimeKind.Local).ToUniversalTime();
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var data = await _context.RevisionesJuridicas
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new RevisionJuridicaDto
            {
                Id = x.Id,
                Tipo = x.Tipo,
                Codigo = x.Codigo,
                Destino = x.Destino,
                Origen = x.Origen,
                Fecha = x.Fecha,
                FechaHora = x.FechaHora,
                Motivo = x.Motivo,
                Recepcion = x.Recepcion,
                Firma = x.Firma,
                Entrega = x.Entrega,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();

        return Ok(data);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] RevisionJuridicaDto dto)
    {
        var item = new RevisionJuridica
        {
            Tipo = dto.Tipo,
            Codigo = dto.Codigo,
            Destino = dto.Destino,
            Origen = dto.Origen,
            Fecha = dto.Fecha,
            FechaHora = ConvertirFechaUtc(dto.FechaHora),
            Motivo = dto.Motivo,
            Recepcion = dto.Recepcion,
            Firma = dto.Firma,
            Entrega = dto.Entrega,
            CreatedAt = DateTime.UtcNow
        };

        _context.RevisionesJuridicas.Add(item);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registro jurídico creado correctamente" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] RevisionJuridicaDto dto)
    {
        var item = await _context.RevisionesJuridicas.FindAsync(id);

        if (item == null)
        {
            return NotFound(new { message = "Registro no encontrado" });
        }

        item.Tipo = dto.Tipo;
        item.Codigo = dto.Codigo;
        item.Destino = dto.Destino;
        item.Origen = dto.Origen;
        item.Fecha = dto.Fecha;
        item.FechaHora = ConvertirFechaUtc(dto.FechaHora);
        item.Motivo = dto.Motivo;
        item.Recepcion = dto.Recepcion;
        item.Firma = dto.Firma;
        item.Entrega = dto.Entrega;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Registro jurídico modificado correctamente" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        var item = await _context.RevisionesJuridicas.FindAsync(id);

        if (item == null)
        {
            return NotFound(new { message = "Registro no encontrado" });
        }

        _context.RevisionesJuridicas.Remove(item);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registro jurídico eliminado correctamente" });
    }
}